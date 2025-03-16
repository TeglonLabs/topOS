"use strict";(self.webpackChunkrio_docs=self.webpackChunkrio_docs||[]).push([[5805],{5027:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>c,contentTitle:()=>l,default:()=>d,frontMatter:()=>s,metadata:()=>o,toc:()=>a});const o=JSON.parse('{"id":"install/terminfo","title":"Terminfo","description":"To make sure Rio works correctly, the \\"rio\\" terminfo must be used. The rio terminfo will be picked up automatically if it is installed.","source":"@site/docs/install/terminfo.md","sourceDirName":"install","slug":"/install/terminfo","permalink":"/pt-br/docs/install/terminfo","draft":false,"unlisted":false,"editUrl":"https://github.com/raphamorim/rio/tree/main/docs/docs/install/terminfo.md","tags":[],"version":"current","frontMatter":{"title":"Terminfo","language":"en"},"sidebar":"tutorialSidebar","previous":{"title":"MacOS","permalink":"/pt-br/docs/install/macos"},"next":{"title":"Using cargo","permalink":"/pt-br/docs/install/using-cargo"}}');var r=n(4848),i=n(8453);const s={title:"Terminfo",language:"en"},l=void 0,c={},a=[];function m(e){const t={code:"code",p:"p",pre:"pre",...(0,i.R)(),...e.components};return(0,r.jsxs)(r.Fragment,{children:[(0,r.jsx)(t.p,{children:'To make sure Rio works correctly, the "rio" terminfo must be used. The rio terminfo will be picked up automatically if it is installed.'}),"\n",(0,r.jsx)(t.p,{children:"If the following command returns without any errors, the rio terminfo is already installed:"}),"\n",(0,r.jsx)(t.pre,{children:(0,r.jsx)(t.code,{className:"language-sh",children:"infocmp rio\n"})}),"\n",(0,r.jsx)(t.p,{children:"If it is not present already, you can install it globally with the following command:"}),"\n",(0,r.jsxs)(t.p,{children:["When cloned locally, from the root of the repository run ",(0,r.jsx)(t.code,{children:"sudo tic -xe rio misc/rio.terminfo"})]}),"\n",(0,r.jsx)(t.p,{children:"If the source code has not been cloned locally:"}),"\n",(0,r.jsx)(t.pre,{children:(0,r.jsx)(t.code,{className:"language-sh",children:"curl -o rio.terminfo https://raw.githubusercontent.com/raphamorim/rio/main/misc/rio.terminfo\nsudo tic -xe rio rio.terminfo\nrm rio.terminfo\n"})})]})}function d(e={}){const{wrapper:t}={...(0,i.R)(),...e.components};return t?(0,r.jsx)(t,{...e,children:(0,r.jsx)(m,{...e})}):m(e)}},8453:(e,t,n)=>{n.d(t,{R:()=>s,x:()=>l});var o=n(6540);const r={},i=o.createContext(r);function s(e){const t=o.useContext(i);return o.useMemo((function(){return"function"==typeof e?e(t):{...t,...e}}),[t,e])}function l(e){let t;return t=e.disableParentContext?"function"==typeof e.components?e.components(r):e.components||r:s(e.components),o.createElement(i.Provider,{value:t},e.children)}}}]);