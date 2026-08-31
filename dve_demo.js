
const { compileVectorUI } = require("./src/vector_engine/index.js");

const source = `
<DBox className="w-full flex flex-col p-4 bg-[#0f172a]">
    <DBox className="flex h-12 bg-[#1e293b] rounded-xl p-2 gap-4">
        <DText className="text-[#38bdf8] font-bold">Dolphin Workspace</DText>
        <DButton className="bg-[#0284c7]" onclick="bus.emit(0x04)">Render Video</DButton>
    </DBox>
</DBox>
`;

const resultSvg = compileVectorUI(source);
console.log("? Compilation Successful! Rendered SVG Output:\n");
console.log(resultSvg);

