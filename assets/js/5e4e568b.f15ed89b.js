"use strict";(self.webpackChunkrio_docs=self.webpackChunkrio_docs||[]).push([[4407],{6003:(e,n,i)=>{i.r(n),i.d(n,{assets:()=>a,contentTitle:()=>r,default:()=>d,frontMatter:()=>s,metadata:()=>o,toc:()=>c});const o=JSON.parse('{"id":"install/windows","title":"Windows","description":"Note: Rio is only available for Windows 10 or later.","source":"@site/docs/install/windows.md","sourceDirName":"install","slug":"/install/windows","permalink":"/docs/install/windows","draft":false,"unlisted":false,"editUrl":"https://github.com/raphamorim/rio/tree/main/docs/docs/install/windows.md","tags":[],"version":"current","frontMatter":{"title":"Windows","language":"en"},"sidebar":"tutorialSidebar","previous":{"title":"WebAssembly","permalink":"/docs/install/webassembly"},"next":{"title":"bindings","permalink":"/docs/key-bindings"}}');var t=i(4848),l=i(8453);const s={title:"Windows",language:"en"},r=void 0,a={},c=[];function h(e){const n={a:"a",code:"code",li:"li",ol:"ol",p:"p",pre:"pre",ul:"ul",...(0,l.R)(),...e.components};return(0,t.jsxs)(t.Fragment,{children:[(0,t.jsx)(n.p,{children:"Note: Rio is only available for Windows 10 or later."}),"\n",(0,t.jsx)(n.p,{children:"Prebuilt binaries for Windows:"}),"\n",(0,t.jsxs)(n.ul,{children:["\n",(0,t.jsxs)(n.li,{children:["\n",(0,t.jsx)(n.p,{children:(0,t.jsx)(n.a,{href:"https://github.com/raphamorim/rio/releases/latest/download/rio-installer-x86_64.msi",children:"Download MSI installer for x86_64"})}),"\n"]}),"\n",(0,t.jsxs)(n.li,{children:["\n",(0,t.jsx)(n.p,{children:(0,t.jsx)(n.a,{href:"https://github.com/raphamorim/rio/releases/latest/download/rio-portable-x86_64.exe",children:"Download portable executable for x86_64"})}),"\n"]}),"\n",(0,t.jsxs)(n.li,{children:["\n",(0,t.jsx)(n.p,{children:(0,t.jsx)(n.a,{href:"https://github.com/raphamorim/rio/releases/latest/download/rio-installer-aarch64.msi",children:"Download MSI installer for aarch64"})}),"\n"]}),"\n",(0,t.jsxs)(n.li,{children:["\n",(0,t.jsx)(n.p,{children:(0,t.jsx)(n.a,{href:"https://github.com/raphamorim/rio/releases/latest/download/rio-portable-aarch64.exe",children:"Download portable executable for aarch64"})}),"\n"]}),"\n",(0,t.jsxs)(n.li,{children:["\n",(0,t.jsx)(n.p,{children:"Using WinGet package manager:"}),"\n"]}),"\n"]}),"\n",(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{className:"language-sh",children:"winget install -e --id raphamorim.rio\n"})}),"\n",(0,t.jsxs)(n.ul,{children:["\n",(0,t.jsx)(n.li,{children:(0,t.jsx)(n.a,{href:"https://community.chocolatey.org/packages/rio-terminal",children:"Using Chocolatey package manager"})}),"\n"]}),"\n",(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{className:"language-sh",children:"choco install rio-terminal\n"})}),"\n",(0,t.jsxs)(n.ul,{children:["\n",(0,t.jsxs)(n.li,{children:["Using MINGW package manager: ",(0,t.jsx)(n.a,{href:"https://packages.msys2.org/base/mingw-w64-rio",children:"packages.msys2.org/base/mingw-w64-rio"})]}),"\n"]}),"\n",(0,t.jsx)(n.p,{children:"There's a few things to note about the installer and the portable version:"}),"\n",(0,t.jsxs)(n.ul,{children:["\n",(0,t.jsx)(n.li,{children:'The browser will ask if you want to keep the file, click "Keep" to save the installer/executable on your computer.'}),"\n",(0,t.jsx)(n.li,{children:'When opening the file, Windows will give you a warning, click "More info" and then "Run anyway" to run the installer/executable.'}),"\n"]}),"\n",(0,t.jsxs)(n.p,{children:["If you want to change the default shell to the new PowerShell platform, change the following line in your config file (see ",(0,t.jsx)(n.a,{href:"/docs/config",children:"Configuration file"})," for more information):"]}),"\n",(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{className:"language-toml",children:'shell = { program = "pwsh", args = ["--login"] }\n'})}),"\n",(0,t.jsx)(n.p,{children:"You may want to use a specific GPU on your system, specially if you're on a laptop configuration, this can enable hardware acceleration and improve performance of the application.\nTo make Windows utilize a GPU for a specific application through Windows display settings, follow the instructions:"}),"\n",(0,t.jsxs)(n.ol,{children:["\n",(0,t.jsx)(n.li,{children:'Simultaneously press the Windows key and the letter "i" on your keyboard to open Windows Settings.'}),"\n",(0,t.jsx)(n.li,{children:"Select System."}),"\n",(0,t.jsx)(n.li,{children:"Choose the Display option."}),"\n",(0,t.jsx)(n.li,{children:"Click on the Graphics setting link located at the bottom of the page."}),"\n",(0,t.jsx)(n.li,{children:"Select the application from the list or press the Browse button, then select the executable file for the application."}),"\n",(0,t.jsx)(n.li,{children:"Click on the Options button to display the GPU selection window."}),"\n",(0,t.jsx)(n.li,{children:"Choose the GPU you want to prioritize for the selected application."}),"\n",(0,t.jsx)(n.li,{children:"Click on the Save button."}),"\n"]})]})}function d(e={}){const{wrapper:n}={...(0,l.R)(),...e.components};return n?(0,t.jsx)(n,{...e,children:(0,t.jsx)(h,{...e})}):h(e)}},8453:(e,n,i)=>{i.d(n,{R:()=>s,x:()=>r});var o=i(6540);const t={},l=o.createContext(t);function s(e){const n=o.useContext(l);return o.useMemo((function(){return"function"==typeof e?e(n):{...n,...e}}),[n,e])}function r(e){let n;return n=e.disableParentContext?"function"==typeof e.components?e.components(t):e.components||t:s(e.components),o.createElement(l.Provider,{value:n},e.children)}}}]);