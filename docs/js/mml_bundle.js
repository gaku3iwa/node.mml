!function(e,t){"object"==typeof exports&&"object"==typeof module?module.exports=t():"function"==typeof define&&define.amd?define([],t):"object"==typeof exports?exports.mml=t():e.mml=t()}(this,(()=>(()=>{"use strict";var e={d:(t,a)=>{for(var l in a)e.o(a,l)&&!e.o(t,l)&&Object.defineProperty(t,l,{enumerable:!0,get:a[l]})},o:(e,t)=>Object.prototype.hasOwnProperty.call(e,t),r:e=>{"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})}},t={};e.r(t),e.d(t,{assemble:()=>r,parser:()=>u,play:()=>o});const a=(e,t)=>60/e*(4/t),l=e=>440*Math.pow(2,(e-69)/12),c=[{"d-":l(1),"e-":l(3),"f-":l(4),"g-":l(6),"a-":l(8),"b-":l(10),"c ":l(0),"d ":l(2),"e ":l(4),"f ":l(5),"g ":l(7),"a ":l(9),"b ":l(11),"c#":l(1),"d#":l(3),"e#":l(5),"f#":l(6),"g#":l(8),"a#":l(10),"b#":l(12)},{"c-":l(11),"d-":l(13),"e-":l(15),"f-":l(16),"g-":l(18),"a-":l(20),"b-":l(22),"c ":l(12),"d ":l(14),"e ":l(16),"f ":l(17),"g ":l(19),"a ":l(21),"b ":l(23),"c#":l(13),"d#":l(15),"e#":l(17),"f#":l(18),"g#":l(20),"a#":l(22),"b#":l(24)},{"c-":l(23),"d-":l(25),"e-":l(27),"f-":l(28),"g-":l(30),"a-":l(32),"b-":l(34),"c ":l(24),"d ":l(26),"e ":l(28),"f ":l(29),"g ":l(31),"a ":l(33),"b ":l(35),"c#":l(25),"d#":l(27),"e#":l(29),"f#":l(30),"g#":l(32),"a#":l(34),"b#":l(36)},{"c-":l(35),"d-":l(37),"e-":l(39),"f-":l(40),"g-":l(42),"a-":l(44),"b-":l(46),"c ":l(36),"d ":l(38),"e ":l(40),"f ":l(41),"g ":l(43),"a ":l(45),"b ":l(47),"c#":l(37),"d#":l(39),"e#":l(41),"f#":l(42),"g#":l(44),"a#":l(46),"b#":l(48)},{"c-":l(47),"d-":l(49),"e-":l(51),"f-":l(52),"g-":l(54),"a-":l(56),"b-":l(58),"c ":l(48),"d ":l(50),"e ":l(52),"f ":l(53),"g ":l(55),"a ":l(57),"b ":l(59),"c#":l(49),"d#":l(51),"e#":l(53),"f#":l(54),"g#":l(56),"a#":l(58),"b#":l(60)},{"c-":l(59),"d-":l(61),"e-":l(63),"f-":l(64),"g-":l(66),"a-":l(68),"b-":l(70),"c ":l(60),"d ":l(62),"e ":l(64),"f ":l(65),"g ":l(67),"a ":l(69),"b ":l(71),"c#":l(61),"d#":l(63),"e#":l(65),"f#":l(66),"g#":l(68),"a#":l(70),"b#":l(72)},{"c-":l(71),"d-":l(73),"e-":l(75),"f-":l(76),"g-":l(78),"a-":l(80),"b-":l(82),"c ":l(72),"d ":l(74),"e ":l(76),"f ":l(77),"g ":l(79),"a ":l(81),"b ":l(83),"c#":l(73),"d#":l(75),"e#":l(77),"f#":l(78),"g#":l(80),"a#":l(82),"b#":l(84)},{"c-":l(83),"d-":l(85),"e-":l(87),"f-":l(88),"g-":l(90),"a-":l(92),"b-":l(94),"c ":l(84),"d ":l(86),"e ":l(88),"f ":l(89),"g ":l(91),"a ":l(93),"b ":l(95),"c#":l(85),"d#":l(87),"e#":l(89),"f#":l(90),"g#":l(92),"a#":l(94),"b#":l(96)},{"c-":l(95),"d-":l(97),"e-":l(99),"f-":l(100),"g-":l(102),"a-":l(104),"b-":l(106),"c ":l(96),"d ":l(98),"e ":l(100),"f ":l(101),"g ":l(103),"a ":l(105),"b ":l(107),"c#":l(97),"d#":l(99),"e#":l(101),"f#":l(102),"g#":l(104),"a#":l(106),"b#":l(108)},{"c-":l(107),"d-":l(109),"e-":l(111),"f-":l(112),"g-":l(114),"a-":l(116),"b-":l(118),"c ":l(108),"d ":l(110),"e ":l(112),"f ":l(113),"g ":l(115),"a ":l(117),"b ":l(119),"c#":l(109),"d#":l(111),"e#":l(113),"f#":l(114),"g#":l(116),"a#":l(118),"b#":l(120)},{"c-":l(119),"d-":l(121),"e-":l(123),"f-":l(124),"g-":l(126),"c ":l(120),"d ":l(122),"e ":l(124),"f ":l(125),"g ":l(127),"c#":l(121),"d#":l(123),"e#":l(125),"f#":l(126)}],n=(e,t,l)=>{const c={type:0,gateTime:0,depth:0,speed:0};if(e.length<1)return c;let n=e.split("/")||"";if(3===n.length||4===n.length){c.type=Number(n[0]),c.depth=Number(n[2]);let e=4===n.length?n[3]:l;if(e.includes(".")){let l=Number(e.replace(".",""));c.gateTime=a(t,l)+a(t,2*l)}else{let l=Number(e);c.gateTime=a(t,l)}c.speed=Number(n[1])/c.gateTime}return c},r=e=>{const t=new AudioContext,l=t.destination,r=l.context,s=[],i=t.currentTime;return e.forEach((e=>{const t=r.createOscillator(),l=r.createGain(),u=r.createStereoPanner();let o=0;const m=r.createGain();m.gain.value=0,m.connect(t.frequency);const p=r.createOscillator();p.frequency.value=0,p.connect(m);const g=r.createGain();g.gain.value=0,g.connect(l.gain);const f=r.createOscillator();f.frequency.value=0,f.connect(g),e.toneAry.forEach((e=>{let r=0,s=0;if("r "===e.tn[0])t.frequency.setValueAtTime(0,o),l.gain.setValueAtTime(0,o),u.pan.setValueAtTime(0,o),m.gain.setValueAtTime(0,o),p.frequency.setValueAtTime(0,o),g.gain.setValueAtTime(0,o),f.frequency.setValueAtTime(0,o),e.q=8,e.l.forEach((t=>{if(t.includes(".")){let l=Number(t.replace(".",""));r+=a(e.t,l)+a(e.t,2*l)}else{let l=Number(t);r+=a(e.t,l)}})),s=r*e.q/8,o+=s;else{let i=o,d=0;for(let r=0;r<e.tn.length;++r){if(0===r){let a=Math.cos(.5*(1-e.v[r]/15)*Math.PI);l.gain.setValueAtTime(a,i);let s=e.p[r]/8;u.pan.setValueAtTime(s,i);let o=c[e.o[r]][e.tn[r].replace("+","#")];t.frequency.setValueAtTime(o,i);let d=n(e.m[r]||"",e.t,e.l[r]);switch(d.type){case 1:m.gain.setValueAtTime(d.depth,i),p.frequency.setValueAtTime(d.speed,i),m.gain.setValueAtTime(0,i+d.gateTime),p.frequency.setValueAtTime(0,i+d.gateTime);break;case 2:g.gain.setValueAtTime(d.depth,i),f.frequency.setValueAtTime(d.speed,i),g.gain.setValueAtTime(0,i+d.gateTime),f.frequency.setValueAtTime(0,i+d.gateTime)}}let s=e.l[r];if(s.includes(".")){let t=Number(s.replace(".",""));d=a(e.t,t)+a(e.t,2*t)}else{let t=Number(s);d=a(e.t,t)}if(i+=d,1<e.tn.length&&r!==e.tn.length-1){let a=Math.sin(e.v[r+1]/15*.5*Math.PI);l.gain.linearRampToValueAtTime(a,i);let s=e.p[r+1]/8;u.pan.linearRampToValueAtTime(s,i);let o=c[e.o[r+1]][e.tn[r+1].replace("+","#")];t.frequency.exponentialRampToValueAtTime(o,i);let d=n(e.m[r+1]||"",e.t,e.l[r+1]);switch(d.type){case 1:m.gain.setValueAtTime(d.depth,i),p.frequency.setValueAtTime(d.speed,i),m.gain.setValueAtTime(0,i+d.gateTime),p.frequency.setValueAtTime(0,i+d.gateTime);break;case 2:g.gain.setValueAtTime(d.depth,i),f.frequency.setValueAtTime(d.speed,i),g.gain.setValueAtTime(0,i+d.gateTime),f.frequency.setValueAtTime(0,i+d.gateTime)}}}if(e.l.forEach((t=>{if(t.includes(".")){let l=Number(t.replace(".",""));r+=a(e.t,l)+a(e.t,2*l)}else{let l=Number(t);r+=a(e.t,l)}})),s=r*e.q/8,o+=s,e.v.length<2){let e=l.gain.value;l.gain.exponentialRampToValueAtTime(.5*e,o)}}e.q<8&&(t.frequency.setValueAtTime(0,o),l.gain.setValueAtTime(0,o),u.pan.setValueAtTime(0,o),m.gain.setValueAtTime(0,o),p.frequency.setValueAtTime(0,o),g.gain.setValueAtTime(0,o),f.frequency.setValueAtTime(0,o),o+=r-s)})),t.type="square",t.start(i),t.stop(i+o),p.start(i),p.stop(i+o),f.start(i),f.stop(i+o),t.connect(l),l.connect(u),s.push(u)})),s.forEach((e=>e.connect(l))),t},s=(e,t,a)=>{let l={key:t,value:a,index:-1};for(var c=e.length-1;c>=0;--c)if(e[c].ctrl===t){l.value=Number(e[c].param),l.index=c;break}return l},i=(e,t)=>{const a={t:Math.max(Math.min(s(e,"t",120).value,480),1),v:Math.max(Math.min(s(e,"v",10).value,15),0),p:Math.max(Math.min(s(e,"p",0).value,8),-8),o:Math.max(Math.min(s(e,"o",4).value,9),1),q:Math.max(Math.min(s(e,"q",8).value,8),1),tn:"c",l:"4",j:0,m:""};let l=s(e,"!",10);-1!==l.index&&(a.v=Math.max(Math.min(l.value,15),0),e.splice(l.index,1));let c=s(e,"&",a.j);a.j=Math.max(Math.min(c.value,1),0),1===a.j&&e.splice(c.index,1);let n=((e,t)=>{let a={key:"m",value:"",index:-1};for(var l=e.length-1;l>=0;--l)if("m"===e[l].ctrl){a.value=e[l].param,a.index=l;break}return a})(e);-1!==n.index&&(a.m=n.value,e.splice(n.index,1));let r=s(e,"l",a.l);return a.l=""===t.len?r.value.toString():"."===t.len?r.value.toString()+".":t.len,a.tn=(t.tone+"  ").slice(0,2),a},u=e=>{const t=[];return e.forEach((e=>{let a={ctrl:"",param:"",tone:"",len:""},l=JSON.parse(JSON.stringify(a)),c=[],n=[];Array.prototype.forEach.call(e,(e=>{const t=e.toLowerCase();switch(t){case"t":case"v":case"p":case"o":case"l":case"q":case">":case"<":case"!":case"m":switch(l.ctrl===t&&l.tone===t||(""!==l.ctrl&&c.push(l),""!==l.tone&&n.push(i(c,l)),l=JSON.parse(JSON.stringify(a))),t){case"t":l.ctrl="t";break;case"v":l.ctrl="v";break;case"p":l.ctrl="p";break;case"o":l.ctrl="o";break;case"q":l.ctrl="q";break;case"l":l.ctrl="l";break;case">":{let e=s(c,"o",4);l.ctrl=e.key,l.param=(e.value+1).toString()}break;case"<":{let e=s(c,"o",4);l.ctrl=e.key,l.param=(e.value-1).toString()}break;case"!":l.ctrl="!";break;case"m":l.ctrl="m"}break;case"&":l.ctrl===t&&l.tone===t||(""!==l.ctrl&&c.push(l),""!==l.tone&&n.push(i(c,l)),l=JSON.parse(JSON.stringify(a)),l.ctrl="&",l.param="1");break;case"r":case"a":case"b":case"c":case"d":case"e":case"f":case"g":l.ctrl===t&&l.tone===t||(""!==l.ctrl&&c.push(l),""!==l.tone&&n.push(i(c,l)),l=JSON.parse(JSON.stringify(a))),l.tone+=t;break;case"-":case"+":case"#":1===l.tone.length&&"a"<=l.tone&&l.tone<="g"&&(l.tone+=t),"p"!==l.ctrl||"-"!==t&&"+"!==t||(l.param+=t);break;case".":"m"===l.ctrl&&(l.param+=t),""===l.tone||l.len.includes(".")||(l.len+=t);break;case"/":"m"===l.ctrl&&(l.param+=t);break;case"0":case"1":case"2":case"3":case"4":case"5":case"6":case"7":case"8":case"9":""!==l.ctrl&&(l.param+=t),""!==l.tone&&(l.len+=t)}})),""!==l.ctrl&&c.push(l),""!==l.tone&&n.push(i(c,l));let r=[];for(let e=0;e<n.length;++e){let t={t:n[e].t,q:n[e].q,v:[],p:[],o:[],l:[],m:[],tn:[]};1===n[e].j&&0<r.length?(t=r[r.length-1],t.v.push(n[e].v),t.p.push(n[e].p),t.o.push(n[e].o),t.l.push(n[e].l),t.m.push(n[e].m),t.tn.push(n[e].tn)):(t.v.push(n[e].v),t.p.push(n[e].p),t.o.push(n[e].o),t.l.push(n[e].l),t.m.push(n[e].m),t.tn.push(n[e].tn),r.push(t))}r.forEach((e=>{console.log(`T${("   "+e.t.toString()).slice(-3)} Q[${e.q}] V[${e.v}] P[${e.p}] O[${e.o}][${e.tn}] L[${e.l}] LFO[${e.m}]`)})),console.log("-".repeat(40));let u={};u.toneAry=r,t.push(u)})),t},o=e=>{if(mml_data.mml.length-1<e)return;let t=mml_data.mml[e].part||"";return""!==t?r(u(t)):void 0};return t})()));
//# sourceMappingURL=mml_bundle.js.map