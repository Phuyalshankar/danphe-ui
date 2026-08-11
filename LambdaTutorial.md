# 🎯 Lambda Functions in Dolphin Native 2 - Complete Tutorial

## 📚 Table of Contents
1. [What are Lambda Functions?](#what-are-lambda-functions)
2. [Basic Lambda Syntax](#basic-lambda-syntax)
3. [Lambda vs Regular Functions](#lambda-vs-regular-functions)
4. [Using Lambda in Dolphin Native](#using-lambda-in-dolphin-native)
5. [Inline Action Handlers](#inline-action-handlers)
6. [Lambda with State Management](#lambda-with-state-management)
7. [Advanced Lambda Patterns](#advanced-lambda-patterns)
8. [Best Practices](#best-practices)
9. [Real-World Examples](#real-world-examples)

---

## 1. What are Lambda Functions?

**Lambda functions** (also called Arrow Functions in JavaScript) are anonymous, inline functions with shorter syntax.

### Traditional Function:
```javascript
function add(a, b) {
  return a + b;
}
```

### Lambda Function (Arrow Function):
```javascript
const add = (a, b) => a + b;
```

---

## 2. Basic Lambda Syntax

### Simple Lambda (One Parameter):
```javascript
const square = x => x * x;
console.log(square(5)); // 25
```

### Multiple Parameters:
```javascript
const multiply = (a, b) => a * b;
console.log(multiply(3, 4)); // 12
```

### No Parameters:
```javascript
const greet = () => 'Hello World!';
console.log(greet()); // Hello World!
```

### With Code Block:
```javascript
const calculateTotal = (price, tax) => {
  const taxAmount = price * tax;
  const total = price + taxAmount;
  return total;
};
```

### Multi-line with Implicit Return:
```javascript
const formatUser = user => ({
  name: user.name.toUpperCase(),
  email: user.email.toLowerCase(),
  age: user.age
});
```

---

## 3. Lambda vs Regular Functions

| Feature | Regular Function | Lambda Function |
|---------|-----------------|-----------------|
| **Syntax** | `function name() {}` | `const name = () => {}` |
| **`this` binding** | Has own `this` | Inherits parent `this` |
| **`arguments` object** | Yes | No (use rest params) |
| **Constructor** | Can be used as constructor | Cannot |
| **Hoisting** | Hoisted | Not hoisted |
| **Use Case** | Methods, constructors | Callbacks, short functions |

### Example - `this` Binding:

```javascript
// Regular Function
const obj1 = {
  count: 0,
  increment: function() {
    this.count++; // 'this' refers to obj1
  }
};

// Lambda Function
const obj2 = {
  count: 0,
  increment: () => {
    this.count++; // 'this' refers to parent scope, NOT obj2
  }
};
```

---

## 4. Using Lambda in Dolphin Native

### Method 1: Inline Lambda Actions

```javascript
const app = require('dolphin-native').createApp();

// Define action with lambda
app.action('increment', () => {
  const current = parseInt(app.getState('count') || 0);
  app.state('count', current + 1);
});

// Short lambda
app.action('reset', () => app.state('count', 0));

// Lambda with parameters
app.action('addValue', (value) => {
  const current = parseInt(app.getState('count') || 0);
  app.state('count', current + parseInt(value));
});
```

### Method 2: Lambda in Screen Definition

```javascript
const HomeScreen = () => (
  <screen className="flex-column items-center p-4">
    <text className="text-2xl mb-4">[stateKey:count]</text>
    <button action="increment" className="bg-blue-500 text-white px-4 py-2">
      Increment
    </button>
  </screen>
);
```

### Method 3: Lambda with Array Methods

```javascript
// Filter products
const filterProducts = () => {
  const products = app.getState('products') || [];
  const filtered = products.filter(p => p.price < 1000);
  app.state('filteredProducts', filtered);
};

// Map data transformation
const formatUsers = () => {
  const users = app.getState('users') || [];
  const formatted = users.map(u => ({
    ...u,
    fullName: `${u.firstName} ${u.lastName}`
  }));
  app.state('formattedUsers', formatted);
};

// Reduce for calculations
const calculateTotal = () => {
  const cart = app.getState('cart') || [];
  const total = cart.reduce((sum, item) => sum + item.price, 0);
  app.state('cartTotal', total);
};
```

---

## 5. Inline Action Handlers

### Basic Inline Handler:
```javascript
const app = require('dolphin-native').createApp();

// Initialize state
app.state('count', 0);
app.state('message', 'Hello');

// Inline lambda handlers
app.action('increment', () => {
  app.state('count', app.getState('count') + 1);
});

app.action('decrement', () => {
  app.state('count', app.getState('count') - 1);
});

app.action('greet', (name) => {
  app.state('message', `Hello, ${name}!`);
});
```

### Chained Lambda Actions:
```javascript
app.action('multiUpdate', () => {
  app.state('count', 0);
  app.state('message', 'Reset complete');
  app.state('timestamp', new Date().toISOString());
});
```

---

## 6. Lambda with State Management

### Simple State Updates:
```javascript
// Counter app
app.state('counter', 0);

app.action('increment', () => 
  app.state('counter', app.getState('counter') + 1)
);

app.action('decrement', () => 
  app.state('counter', app.getState('counter') - 1)
);

app.action('reset', () => app.state('counter', 0));

app.action('setValue', (val) => 
  app.state('counter', parseInt(val))
);
```

### Complex State Management:
```javascript
// Shopping cart
app.state('cart', []);

app.action('addToCart', (productId, name, price) => {
  const cart = app.getState('cart') || [];
  const newItem = { 
    id: productId, 
    name, 
    price: parseFloat(price),
    quantity: 1 
  };
  app.state('cart', [...cart, newItem]);
});

app.action('removeFromCart', (productId) => {
  const cart = app.getState('cart') || [];
  app.state('cart', cart.filter(item => item.id !== productId));
});

app.action('updateQuantity', (productId, newQty) => {
  const cart = app.getState('cart') || [];
  const updated = cart.map(item => 
    item.id === productId 
      ? { ...item, quantity: parseInt(newQty) }
      : item
  );
  app.state('cart', updated);
});

app.action('calculateTotal', () => {
  const cart = app.getState('cart') || [];
  const total = cart.reduce((sum, item) => 
    sum + (item.price * item.quantity), 0
  );
  app.state('cartTotal', total.toFixed(2));
});
```

---

## 7. Advanced Lambda Patterns

### 1. Higher-Order Functions (Functions returning functions):
```javascript
const createCounter = (initialValue) => {
  let count = initialValue;
  
  return {
    increment: () => ++count,
    decrement: () => --count,
    getValue: () => count,
    reset: () => count = initialValue
  };
};

const counter = createCounter(10);
console.log(counter.increment()); // 11
console.log(counter.getValue());  // 11
```

### 2. Currying with Lambda:
```javascript
const multiply = (a) => (b) => a * b;

const double = multiply(2);
const triple = multiply(3);

console.log(double(5));  // 10
console.log(triple(5));  // 15
```

### 3. Lambda with Async/Await:
```javascript
// Async lambda for API calls
app.action('fetchUserData', async (userId) => {
  app.state('loading', true);
  
  try {
    const response = await fetch(`/api/users/${userId}`);
    const data = await response.json();
    app.state('userData', data);
    app.state('error', null);
  } catch (error) {
    app.state('error', error.message);
  } finally {
    app.state('loading', false);
  }
});
```

### 4. Lambda with Closures:
```javascript
const createLogger = (prefix) => {
  return (message) => {
    const timestamp = new Date().toISOString();
    console.log(`[${prefix}] ${timestamp}: ${message}`);
  };
};

const errorLog = createLogger('ERROR');
const infoLog = createLogger('INFO');

errorLog('Something went wrong');  // [ERROR] 2026-08-11T...: Something went wrong
infoLog('App started');            // [INFO] 2026-08-11T...: App started
```

### 5. Lambda for Event Handling:
```javascript
const eventHandlers = {
  onClick: (id) => () => console.log(`Clicked: ${id}`),
  onHover: (id) => () => console.log(`Hovered: ${id}`),
  onSubmit: (form) => (e) => {
    e.preventDefault();
    console.log('Form submitted', form);
  }
};

// Usage
const button1Handler = eventHandlers.onClick('button1');
button1Handler(); // Clicked: button1
```

---

## 8. Best Practices

### ✅ DO:

```javascript
// 1. Use for short, simple functions
const add = (a, b) => a + b;

// 2. Use for array methods
const doubled = numbers.map(n => n * 2);
const evens = numbers.filter(n => n % 2 === 0);

// 3. Use for callbacks
setTimeout(() => console.log('Done'), 1000);

// 4. Use for promise chains
fetchData()
  .then(data => data.items)
  .then(items => items.filter(i => i.active))
  .catch(err => console.error(err));

// 5. Use for event handlers
button.addEventListener('click', () => {
  counter++;
  updateDisplay();
});
```

### ❌ DON'T:

```javascript
// 1. DON'T use when you need 'this' binding
const obj = {
  value: 42,
  getValue: () => this.value  // ❌ 'this' is undefined
};

// 2. DON'T use as object methods (usually)
const calculator = {
  sum: (a, b) => a + b,  // ❌ No access to 'this'
};

// 3. DON'T use as constructors
const Person = (name) => {
  this.name = name;  // ❌ Cannot use 'new' with arrow functions
};

// 4. DON'T overuse for complex logic
const complexCalc = (a, b, c, d, e) => {  // ❌ Too complex
  const step1 = a + b;
  const step2 = c * d;
  const step3 = step1 - step2;
  const step4 = step3 / e;
  // ... many more lines
  return step4;
};
// Better: Use regular function for clarity
```

---

## 9. Real-World Examples

### Example 1: Todo App with Lambda

```javascript
const { createApp } = require('dolphin-native');
const app = createApp({ name: 'TodoApp' });

// Initialize state
app.state('todos', []);
app.state('nextId', 1);

// Add todo (lambda)
app.action('addTodo', (text) => {
  const todos = app.getState('todos') || [];
  const id = app.getState('nextId') || 1;
  
  const newTodo = { id, text, completed: false };
  
  app.state('todos', [...todos, newTodo]);
  app.state('nextId', id + 1);
});

// Toggle todo (lambda with find & map)
app.action('toggleTodo', (id) => {
  const todos = app.getState('todos') || [];
  const updated = todos.map(todo =>
    todo.id === parseInt(id)
      ? { ...todo, completed: !todo.completed }
      : todo
  );
  app.state('todos', updated);
});

// Delete todo (lambda with filter)
app.action('deleteTodo', (id) => {
  const todos = app.getState('todos') || [];
  app.state('todos', todos.filter(t => t.id !== parseInt(id)));
});

// Clear completed (lambda with filter)
app.action('clearCompleted', () => {
  const todos = app.getState('todos') || [];
  app.state('todos', todos.filter(t => !t.completed));
});

// Get stats (lambda with reduce)
app.action('updateStats', () => {
  const todos = app.getState('todos') || [];
  
  const total = todos.length;
  const completed = todos.filter(t => t.completed).length;
  const pending = total - completed;
  
  app.state('stats', { total, completed, pending });
});

// Screen
app.screen('Home', () => `
  <screen className="p-4">
    <h1 className="text-2xl font-bold mb-4">Todo App</h1>
    
    <div className="mb-4">
      <p>Total: [stateKey:stats.total]</p>
      <p>Completed: [stateKey:stats.completed]</p>
      <p>Pending: [stateKey:stats.pending]</p>
    </div>
    
    <button action="addTodo:Learn Lambda" className="bg-blue-500 text-white p-2">
      Add Sample Todo
    </button>
  </screen>
`);

app.start();
```

### Example 2: Counter App with Multiple Lambda Patterns

```javascript
const app = require('dolphin-native').createApp();

// State
app.state('count', 0);
app.state('history', []);

// Simple lambda
app.action('increment', () => {
  const count = app.getState('count');
  app.state('count', count + 1);
});

// Lambda with parameter
app.action('addValue', (value) => {
  const count = app.getState('count');
  app.state('count', count + parseInt(value));
});

// Lambda with history tracking
app.action('incrementWithHistory', () => {
  const count = app.getState('count');
  const history = app.getState('history') || [];
  
  const newCount = count + 1;
  
  app.state('count', newCount);
  app.state('history', [
    ...history,
    { action: 'increment', from: count, to: newCount, timestamp: Date.now() }
  ]);
});

// Lambda with validation
app.action('setCount', (value) => {
  const num = parseInt(value);
  if (!isNaN(num) && num >= 0 && num <= 1000) {
    app.state('count', num);
  } else {
    app.state('error', 'Invalid value. Must be 0-1000');
  }
});

// Chained lambda operations
app.action('reset', () => {
  app.state('count', 0);
  app.state('history', []);
  app.state('error', null);
});
```

### Example 3: Form Validation with Lambda

```javascript
const app = require('dolphin-native').createApp();

// Validation lambdas
const validators = {
  email: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
  phone: (value) => /^\d{10}$/.test(value),
  password: (value) => value.length >= 8,
  required: (value) => value && value.trim().length > 0
};

// Validate field
app.action('validateField', (field, value) => {
  const errors = app.getState('errors') || {};
  
  const isValid = validators[field] ? validators[field](value) : true;
  
  if (isValid) {
    delete errors[field];
  } else {
    errors[field] = `Invalid ${field}`;
  }
  
  app.state('errors', errors);
});

// Submit form with lambda validation
app.action('submitForm', () => {
  const email = app.getState('email');
  const phone = app.getState('phone');
  const password = app.getState('password');
  
  const isValid = 
    validators.email(email) &&
    validators.phone(phone) &&
    validators.password(password);
  
  if (isValid) {
    app.state('submitStatus', 'success');
  } else {
    app.state('submitStatus', 'error');
  }
});
```

### Example 4: Data Transformation with Lambda

```javascript
// Transform API response
app.action('processUsers', (apiResponse) => {
  const users = apiResponse.data
    .filter(u => u.active)                    // Filter active users
    .map(u => ({                              // Transform structure
      id: u.user_id,
      name: `${u.first_name} ${u.last_name}`,
      email: u.email.toLowerCase(),
      joined: new Date(u.created_at)
    }))
    .sort((a, b) => a.name.localeCompare(b.name)); // Sort by name
  
  app.state('users', users);
});

// Group data
app.action('groupByCategory', () => {
  const products = app.getState('products') || [];
  
  const grouped = products.reduce((acc, product) => {
    const category = product.category;
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(product);
    return acc;
  }, {});
  
  app.state('groupedProducts', grouped);
});
```

---

## 🎓 Summary

### Key Takeaways:

1. **Lambda functions** provide shorter, cleaner syntax
2. Best for **callbacks, array methods, and simple operations**
3. **Inherit `this`** from parent scope
4. Perfect for **Dolphin Native action handlers**
5. Use **regular functions** when you need `this` binding or complex logic

### When to Use Lambda in Dolphin Native:

✅ Action handlers  
✅ State transformations  
✅ Array operations (map, filter, reduce)  
✅ Event callbacks  
✅ Short utility functions  

### When to Use Regular Functions:

✅ Object methods needing `this`  
✅ Constructor functions  
✅ Complex business logic  
✅ Functions needing `arguments` object  

---

**Happy Coding with Lambda Functions! 🚀**

*For more examples, check the TestApp project in `D:\TestApp\`*
