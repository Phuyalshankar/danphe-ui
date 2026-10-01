#pragma once
#include "builtins.hpp"
#include "patro.hpp"

struct TemplateNamespace {
    var _getValue(const var& data, const std::string& path) {
        if (path.empty()) return var("");
        if (data.isObject() && data.has(path).toBool()) {
            return data[path];
        }
        std::stringstream ss(path);
        std::string part;
        var current = data;
        bool found = true;
        while (std::getline(ss, part, '.')) {
            if (current.isObject() && current.has(part).toBool()) {
                current = current[part];
            } else {
                found = false;
                break;
            }
        }
        if (found) return current;
        if (path == "item" && !data.isObject()) return data;
        return var("");
    }

    var render(const var& templateStr, const var& data) {
        std::string tpl = templateStr.toString();
        std::string result = "";
        size_t pos = 0;
        
        while (pos < tpl.length()) {
            size_t start = tpl.find("{{", pos);
            if (start == std::string::npos) {
                result += tpl.substr(pos);
                break;
            }
            
            result += tpl.substr(pos, start - pos);
            size_t end = tpl.find("}}", start);
            if (end == std::string::npos) {
                result += tpl.substr(start);
                break;
            }
            
            std::string tag = tpl.substr(start + 2, end - start - 2);
            tag.erase(tag.begin(), std::find_if(tag.begin(), tag.end(), [](unsigned char ch) {
                return !std::isspace(ch);
            }));
            tag.erase(std::find_if(tag.rbegin(), tag.rend(), [](unsigned char ch) {
                return !std::isspace(ch);
            }).base(), tag.end());
            
            if (tag.rfind("include ", 0) == 0) {
                std::string inc_path = tag.substr(8);
                // Strip quotes if present
                if (inc_path.length() >= 2 && (inc_path.front() == '"' || inc_path.front() == '\'')) {
                    inc_path = inc_path.substr(1, inc_path.length() - 2);
                }
                var inc_content = File.read(var(inc_path));
                if (!inc_content.isNull() && !inc_content.toString().empty()) {
                    result += render(inc_content, data).toString();
                } else {
                    // Try with views/ prefix if not found
                    var inc_views = File.read(var("views/" + inc_path));
                    if (!inc_views.isNull() && !inc_views.toString().empty()) {
                        result += render(inc_views, data).toString();
                    }
                }
                pos = end + 2;
                continue;
            }
            else if (tag.rfind("loop ", 0) == 0) {
                std::string loop_content = tag.substr(5);
                size_t as_pos = loop_content.find(" as ");
                if (as_pos == std::string::npos) {
                    pos = end + 2;
                    continue;
                }
                std::string container_name = loop_content.substr(0, as_pos);
                std::string item_name = loop_content.substr(as_pos + 4);
                
                size_t loop_end = tpl.find("{{endloop}}", end + 2);
                if (loop_end == std::string::npos) {
                    pos = end + 2;
                    continue;
                }
                
                std::string body = tpl.substr(end + 2, loop_end - end - 2);
                var container = _getValue(data, container_name);
                if (container.isNull() || container.toString() == "") {
                    if (data.isObject() && data.has(container_name).toBool()) {
                        container = data[container_name];
                    }
                }
                
                if (container.isArray()) {
                    for (int i = 0; i < container.size().toInt(); ++i) {
                        var local_data = data;
                        local_data[item_name] = container[i];
                        result += render(body, local_data).toString();
                    }
                }
                pos = loop_end + 11;
            }
            else if (tag.rfind("if ", 0) == 0) {
                std::string cond_name = tag.substr(3);
                size_t if_end = tpl.find("{{endif}}", end + 2);
                if (if_end == std::string::npos) {
                    pos = end + 2;
                    continue;
                }
                
                std::string body = tpl.substr(end + 2, if_end - end - 2);
                var cond = _getValue(data, cond_name);
                
                if (cond.toBool()) {
                    result += render(body, data).toString();
                }
                pos = if_end + 9;
            }
            else {
                var val = _getValue(data, tag);
                if (val.isNull()) {
                    if (data.isObject() && data.has(tag).toBool()) {
                        val = data[tag];
                    }
                }
                if (!val.isNull()) {
                    result += val.toString();
                }
                pos = end + 2;
            }
        }
        return var(result);
    }

    var renderFile(const var& filePath, const var& data) {
        var content = File.read(filePath);
        if (content.isNull()) return var("");
        return render(content, data);
    }
} Template;

inline var dolphin_render_template(const std::string& tpl, const var& data) {
    return Template.render(var(tpl), data);
}

struct MatrixNamespace {
    var create(const var& rows, const var& cols, const var& data = var()) {
        return var::MatrixCreate(rows.toInt(), cols.toInt(), data);
    }
    var zeros(const var& rows, const var& cols) {
        return var::MatrixZeros(rows.toInt(), cols.toInt());
    }
    var ones(const var& rows, const var& cols) {
        return var::MatrixOnes(rows.toInt(), cols.toInt());
    }
    var random(const var& rows, const var& cols) {
        return var::MatrixRandom(rows.toInt(), cols.toInt());
    }
} Matrix;

struct MLNamespace {
    var dense(const var& inputs, const var& outputs) {
        var layer = var(var_object{});
        layer["weights"] = var::MatrixRandom(inputs.toInt(), outputs.toInt());
        layer["biases"] = var::MatrixZeros(1, outputs.toInt());
        return layer;
    }
} ML;

// ─── Universal Table & Dataset Engine: data(...) / Dataset ──────────────────
class DolphinDataset {
public:
    std::shared_ptr<var_array> rows;
    std::string source_file;
    bool is_file_backed = false;

    DolphinDataset() : rows(std::make_shared<var_array>()) {}
    DolphinDataset(const var& init_data, const std::string& path = "") {
        rows = std::make_shared<var_array>();
        source_file = path;
        is_file_backed = !path.empty();
        if (init_data.isArray()) {
            for (int i = 0; i < init_data.size().toInt(); ++i) {
                rows->push_back(init_data[i]);
            }
        } else if (init_data.isObject()) {
            rows->push_back(init_data);
        }
    }

    void persist() {
        if (is_file_backed && !source_file.empty()) {
            File.write(var(source_file), JSON.stringify(var(*rows)));
        }
    }

    int findRowIndex(const var& id_arg) const {
        if (!rows || rows->empty()) return -1;
        
        if (id_arg.getType() == var::TYPE_INT || id_arg.getType() == var::TYPE_DOUBLE) {
            long long target_id = id_arg.toInt();
            for (size_t i = 0; i < rows->size(); ++i) {
                const var& r = (*rows)[i];
                if (r.isObject()) {
                    if (r.has(std::string("id")).toBool() && r["id"].toInt() == target_id) return (int)i;
                    if (r.has(std::string("_id")).toBool() && r["_id"].toInt() == target_id) return (int)i;
                }
            }
            if (target_id >= 0 && (size_t)target_id < rows->size()) {
                return (int)target_id;
            }
            return -1;
        }

        std::string s = id_arg.toString();
        if (s.empty()) return -1;
        std::string raw_id = (s[0] == '#') ? s.substr(1) : s;

        for (size_t i = 0; i < rows->size(); ++i) {
            const var& r = (*rows)[i];
            if (r.isObject()) {
                if (r.has(std::string("id")).toBool() && (r["id"].toString() == s || r["id"].toString() == raw_id)) return (int)i;
                if (r.has(std::string("_id")).toBool() && (r["_id"].toString() == s || r["_id"].toString() == raw_id)) return (int)i;
            }
        }
        return -1;
    }

    bool isExistingColumn(const std::string& colName) const {
        if (!rows || rows->empty()) return false;
        for (size_t i = 0; i < rows->size(); ++i) {
            const var& r = (*rows)[i];
            if (r.isObject() && r.has(colName).toBool()) return true;
        }
        return false;
    }

    var invoke(const std::vector<var>& args) {
        if (args.empty()) {
            return var(*rows);
        }

        // 1. Cell Operations: data(id, col), data(id, col, val/fn)
        if (args.size() >= 2 && (args[0].getType() == var::TYPE_INT || args[0].getType() == var::TYPE_DOUBLE || 
                                (args[0].isString() && (args[0].toString()[0] == '#' || !isExistingColumn(args[0].toString()) || findRowIndex(args[0]) >= 0)))) {
            int rowIdx = findRowIndex(args[0]);
            std::string col = args[1].toString();
            if (rowIdx >= 0 && (size_t)rowIdx < rows->size()) {
                var& targetRow = (*rows)[rowIdx];
                if (args.size() == 2) {
                    if (targetRow.isObject() && targetRow.has(col).toBool()) {
                        return targetRow[col];
                    }
                    return var();
                }
                if (args.size() == 3) {
                    if (args[2].isFunction()) {
                        var oldVal = targetRow[col];
                        var newVal = args[2](std::vector<var>{oldVal});
                        targetRow[col] = newVal;
                        persist();
                        return newVal;
                    } else {
                        targetRow[col] = args[2];
                        persist();
                        return args[2];
                    }
                }
            }
        }

        // 2. Row Operations: data(id), data(id, { updates }), data(id, fn(row))
        if (args.size() == 1 || (args.size() == 2 && (args[1].isObject() || args[1].isFunction()))) {
            int rowIdx = findRowIndex(args[0]);
            if (rowIdx >= 0 && (size_t)rowIdx < rows->size()) {
                var& targetRow = (*rows)[rowIdx];
                if (args.size() == 1) {
                    return targetRow;
                }
                if (args.size() == 2) {
                    if (args[1].isObject()) {
                        for (auto& k : args[1].keys()) {
                            targetRow[k.toString()] = args[1][k.toString()];
                        }
                        persist();
                        return targetRow;
                    } else if (args[1].isFunction()) {
                        var updated = args[1](std::vector<var>{targetRow});
                        if (updated.isObject()) targetRow = updated;
                        persist();
                        return targetRow;
                    }
                }
            }
        }

        // 3. Column Operations & Formulas: data(col), data("sum(col)"), data("total = qty * price")
        if (args.size() == 1 && args[0].isString()) {
            std::string col = args[0].toString();
            size_t eqPos = col.find('=');
            if (eqPos != std::string::npos) {
                std::string newCol = col.substr(0, eqPos);
                std::string expr = col.substr(eqPos + 1);
                newCol.erase(0, newCol.find_first_not_of(" \t"));
                newCol.erase(newCol.find_last_not_of(" \t") + 1);
                for (size_t i = 0; i < rows->size(); ++i) {
                    var& r = (*rows)[i];
                    if (r.isObject()) {
                        if (expr.find('*') != std::string::npos) {
                            size_t star = expr.find('*');
                            std::string op1 = expr.substr(0, star); op1.erase(0, op1.find_first_not_of(" \t")); op1.erase(op1.find_last_not_of(" \t") + 1);
                            std::string op2 = expr.substr(star + 1); op2.erase(0, op2.find_first_not_of(" \t")); op2.erase(op2.find_last_not_of(" \t") + 1);
                            double v1 = r.has(op1).toBool() ? r[op1].toDouble() : atof(op1.c_str());
                            double v2 = r.has(op2).toBool() ? r[op2].toDouble() : atof(op2.c_str());
                            r[newCol] = var(v1 * v2);
                        } else if (expr.find('+') != std::string::npos) {
                            size_t p = expr.find('+');
                            std::string op1 = expr.substr(0, p); op1.erase(0, op1.find_first_not_of(" \t")); op1.erase(op1.find_last_not_of(" \t") + 1);
                            std::string op2 = expr.substr(p + 1); op2.erase(0, op2.find_first_not_of(" \t")); op2.erase(op2.find_last_not_of(" \t") + 1);
                            double v1 = r.has(op1).toBool() ? r[op1].toDouble() : atof(op1.c_str());
                            double v2 = r.has(op2).toBool() ? r[op2].toDouble() : atof(op2.c_str());
                            r[newCol] = var(v1 + v2);
                        }
                    }
                }
                persist();
                return var(*rows);
            }

            if (col.rfind("sum(", 0) == 0 && col.back() == ')') {
                std::string target = col.substr(4, col.length() - 5);
                double sumVal = 0.0;
                for (size_t i = 0; i < rows->size(); ++i) {
                    const var& r = (*rows)[i];
                    if (r.isObject() && r.has(target).toBool()) sumVal += r[target].toDouble();
                }
                return var(sumVal);
            }
            if (col.rfind("avg(", 0) == 0 && col.back() == ')') {
                std::string target = col.substr(4, col.length() - 5);
                double sumVal = 0.0;
                size_t cnt = 0;
                for (size_t i = 0; i < rows->size(); ++i) {
                    const var& r = (*rows)[i];
                    if (r.isObject() && r.has(target).toBool()) { sumVal += r[target].toDouble(); cnt++; }
                }
                return cnt > 0 ? var(sumVal / cnt) : var(0.0);
            }

            var colVec(var_array{});
            for (size_t i = 0; i < rows->size(); ++i) {
                const var& r = (*rows)[i];
                if (r.isObject() && r.has(col).toBool()) {
                    colVec.push(r[col]);
                }
            }
            return colVec;
        }

        // 4. Column Transformation: data(col, fn(val))
        if (args.size() == 2 && args[0].isString() && args[1].isFunction()) {
            std::string col = args[0].toString();
            for (size_t i = 0; i < rows->size(); ++i) {
                var& r = (*rows)[i];
                if (r.isObject() && r.has(col).toBool()) {
                    r[col] = args[1](std::vector<var>{r[col]});
                }
            }
            persist();
            return var(*rows);
        }

        // 5. Table Filter: data(fn(row))
        if (args.size() == 1 && args[0].isFunction()) {
            var filtered(var_array{});
            for (size_t i = 0; i < rows->size(); ++i) {
                if (args[0](std::vector<var>{(*rows)[i]}).toBool()) {
                    filtered.push((*rows)[i]);
                }
            }
            return filtered;
        }

        return var(*rows);
    }
};

static DolphinDataset global_default_dataset;

inline var make_dataset_object(std::shared_ptr<DolphinDataset> ds_ptr) {
    var obj(var_object{});
    obj["_is_dataset"] = var(true);
    obj["_invoke"] = var([ds_ptr](const std::vector<var>& args) -> var {
        return ds_ptr->invoke(args);
    });
    obj["insert"] = var([ds_ptr](const std::vector<var>& args) -> var {
        if (args.size() > 0) {
            ds_ptr->rows->push_back(args[0]);
            ds_ptr->persist();
            return args[0];
        }
        return var();
    });
    obj["find"] = var([ds_ptr](const std::vector<var>& args) -> var {
        var filter_fn = args.size() > 0 ? args[0] : var();
        var arr = var(*(ds_ptr->rows));
        if (!filter_fn.isFunction()) return arr;
        return arr.filter(filter_fn);
    });
    obj["findOne"] = var([ds_ptr](const std::vector<var>& args) -> var {
        if (args.size() > 0 && args[0].isFunction() && ds_ptr->rows) {
            for (size_t i = 0; i < ds_ptr->rows->size(); ++i) {
                if (args[0](std::vector<var>{(*ds_ptr->rows)[i]}).toBool()) {
                    return (*ds_ptr->rows)[i];
                }
            }
        }
        return var();
    });
    obj["all"] = var([ds_ptr](const std::vector<var>&) -> var {
        return var(*(ds_ptr->rows));
    });
    obj["count"] = var([ds_ptr](const std::vector<var>&) -> var {
        return var((long long)ds_ptr->rows->size());
    });
    obj["remove"] = var([ds_ptr](const std::vector<var>& args) -> var {
        if (args.size() > 0 && args[0].isFunction() && ds_ptr->rows) {
            auto new_rows = std::make_shared<var_array>();
            for (size_t i = 0; i < ds_ptr->rows->size(); ++i) {
                if (!args[0](std::vector<var>{(*ds_ptr->rows)[i]}).toBool()) {
                    new_rows->push_back((*ds_ptr->rows)[i]);
                }
            }
            ds_ptr->rows = new_rows;
            ds_ptr->persist();
            return var(true);
        }
        return var(false);
    });
    obj["deleteOne"] = obj["remove"];
    return obj;
}

// ─── Native Embedded Database Engine (Key-Value, Document & JSON DB) ────────
struct DBNamespace {
    std::string default_path;
    var memory_store = var(var_object{});

    DBNamespace() : default_path("dolphin_db.json") {}

    // 1. Open / Connect to database file (e.g. DB.open("app.db"))
    var open(const var& db_name = var("dolphin_db.json")) {
        var instance = var(var_object{});
        std::string path = db_name.toString();
        auto data_ptr = std::make_shared<var_object>();
        auto path_ptr = std::make_shared<std::string>(path);
        
        instance["path"] = var(path);
        
        // Auto-load if file exists
        var file_content = File.read(var(path));
        if (!file_content.isNull() && !file_content.toString().empty()) {
            var parsed = JSON.parse(file_content);
            if (parsed.isObject()) {
                for (const auto& k : parsed.keys()) {
                    (*data_ptr)[k.toString()] = parsed[k.toString()];
                }
            }
        }

        // set(key, val)
        instance["set"] = var([data_ptr, path_ptr](const var& key, const var& val) -> var {
            (*data_ptr)[key.toString()] = val;
            File.write(var(*path_ptr), JSON.stringify(var(*data_ptr)));
            return val;
        });

        // get(key, defaultVal?)
        instance["get"] = var([data_ptr](const var& key, const var& defaultVal = var()) -> var {
            std::string k = key.toString();
            if (data_ptr->find(k) != data_ptr->end()) {
                return (*data_ptr)[k];
            }
            return defaultVal;
        });

        // has(key)
        instance["has"] = var([data_ptr](const var& key) -> var {
            return var(data_ptr->find(key.toString()) != data_ptr->end());
        });

        // delete(key)
        instance["delete"] = var([data_ptr, path_ptr](const var& key) -> var {
            std::string k = key.toString();
            data_ptr->erase(k);
            File.write(var(*path_ptr), JSON.stringify(var(*data_ptr)));
            return var(true);
        });

        // collection(name) -> Document Store for CRUD & Callable data() API
        instance["collection"] = var([data_ptr, path_ptr](const var& col_name) -> var {
            std::string cname = col_name.toString();

            if (data_ptr->find(cname) == data_ptr->end() || !(*data_ptr)[cname].isArray()) {
                (*data_ptr)[cname] = var(var_array{});
            }

            auto ds = std::make_shared<DolphinDataset>((*data_ptr)[cname], *path_ptr);
            var col = make_dataset_object(ds);

            // insert(doc)
            col["insert"] = var([data_ptr, path_ptr, cname, ds](const var& doc) -> var {
                ds->rows->push_back(doc);
                (*data_ptr)[cname] = var(*(ds->rows));
                File.write(var(*path_ptr), JSON.stringify(var(*data_ptr)));
                return doc;
            });

            // find(predicate_or_filter?)
            col["find"] = var([ds](const var& filter_fn = var()) -> var {
                var arr = var(*(ds->rows));
                if (!filter_fn.isFunction()) return arr;
                return arr.filter(filter_fn);
            });

            // findOne(filter_fn)
            col["findOne"] = var([ds](const var& filter_fn) -> var {
                if (filter_fn.isFunction() && ds->rows) {
                    for (size_t i = 0; i < ds->rows->size(); ++i) {
                        if (filter_fn(std::vector<var>{(*ds->rows)[i]}).toBool()) {
                            return (*ds->rows)[i];
                        }
                    }
                }
                return var();
            });

            // count()
            col["count"] = var([ds]() -> var {
                return var((long long)ds->rows->size());
            });

            // remove(predicate_fn)
            col["remove"] = var([data_ptr, path_ptr, cname, ds](const var& predicate_fn) -> var {
                if (predicate_fn.isFunction() && ds->rows) {
                    auto new_rows = std::make_shared<var_array>();
                    for (size_t i = 0; i < ds->rows->size(); ++i) {
                        if (!predicate_fn(std::vector<var>{(*ds->rows)[i]}).toBool()) {
                            new_rows->push_back((*ds->rows)[i]);
                        }
                    }
                    ds->rows = new_rows;
                    (*data_ptr)[cname] = var(*(ds->rows));
                    File.write(var(*path_ptr), JSON.stringify(var(*data_ptr)));
                    return var(true);
                }
                return var(false);
            });

            col["deleteOne"] = col["remove"];
            return col;
        });

        // all()
        instance["all"] = var([data_ptr]() -> var {
            return var(*data_ptr);
        });

        return instance;
    }

    // Direct Global Static Methods
    var set(const var& key, const var& val) {
        memory_store[key.toString()] = val;
        File.write(var(default_path), JSON.stringify(memory_store));
        return val;
    }

    var get(const var& key, const var& defaultVal = var()) {
        std::string k = key.toString();
        if (memory_store.has(k).toBool()) {
            return memory_store[k];
        }
        return defaultVal;
    }

    var collection(const var& name) {
        return open(var(default_path))["collection"](name);
    }

    var connect(const var& uri = var("app.db")) {
        std::string path = uri.toString();
        if (path.empty()) path = "app.db";
        return open(var(path));
    }
} DB, Mongo, MongoDB;

// ─── UI Page Component Engine: UI.page(filepath) ────────────────────────────
// Treats HTML pages as live Dolphin variables with state, conditions, and rendering
struct UINamespace {
    var page(const var& filePath) {
        var comp = var(var_object{});
        comp["_path"] = filePath;
        comp["state"] = var(var_object{});
        comp["_when_hooks"] = var(var_array{});

        // 1. comp.set(key, val) / comp.bind(data)
        comp["bind"] = var([comp](const var& data) mutable -> var {
            if (data.isObject()) {
                comp["state"] = data;
            }
            return comp;
        });

        comp["set"] = var([comp](const var& key, const var& val) mutable -> var {
            comp["state"][key.toString()] = val;
            return comp;
        });

        // 2. comp.when(fn(state) { ... }) — Apply conditional logic
        comp["when"] = var([comp](const var& logic_fn) mutable -> var {
            if (logic_fn.isFunction()) {
                comp["_when_hooks"].push(logic_fn);
            }
            return comp;
        });

        // 3. comp.render(overrideData?) — Produce final rendered HTML string
        comp["render"] = var([comp](const var& extraData = var()) mutable -> var {
            var current_state = comp["state"];
            if (extraData.isObject()) {
                for (auto& k : extraData.keys()) {
                    current_state[k.toString()] = extraData[k.toString()];
                }
            }

            // Execute all .when() condition logic hooks
            var hooks = comp["_when_hooks"];
            if (hooks.isArray()) {
                for (int i = 0; i < hooks.size().toInt(); ++i) {
                    if (hooks[i].isFunction()) {
                        hooks[i](std::vector<var>{current_state});
                    }
                }
            }

            std::string fpath = comp["_path"].toString();
            std::string content;
            if (dolphin_read_file(fpath, content)) {
                return dolphin_render_template(content, current_state);
            }
            // If direct HTML string was passed instead of file
            return dolphin_render_template(fpath, current_state);
        });

    return comp;
    }
} UI;

struct DataNamespace {
    var operator()(const std::vector<var>& args) {
        if (args.empty()) {
            return global_default_dataset.invoke(args);
        }
        if (args.size() == 1) {
            if (args[0].isArray()) {
                auto ds = std::make_shared<DolphinDataset>(args[0]);
                return make_dataset_object(ds);
            }
            if (args[0].isString()) {
                std::string s = args[0].toString();
                if (s.find(".json") != std::string::npos || s.find(".csv") != std::string::npos || s.find(".db") != std::string::npos) {
                    var fileData = File.read(var(s));
                    var parsed = fileData.isNull() ? var(var_array{}) : JSON.parse(fileData);
                    auto ds = std::make_shared<DolphinDataset>(parsed, s);
                    return make_dataset_object(ds);
                }
            }
        }
        return global_default_dataset.invoke(args);
    }
    var operator()() { return (*this)(std::vector<var>{}); }
    var operator()(const var& a1) { return (*this)(std::vector<var>{a1}); }
    var operator()(const var& a1, const var& a2) { return (*this)(std::vector<var>{a1, a2}); }
    var operator()(const var& a1, const var& a2, const var& a3) { return (*this)(std::vector<var>{a1, a2, a3}); }
    var operator()(const var& a1, const var& a2, const var& a3, const var& a4) { return (*this)(std::vector<var>{a1, a2, a3, a4}); }
} data, Data, Table;



