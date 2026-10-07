(()=>{
const T=window.MF_I18N||{},root=document.documentElement,body=document.body,entry=document.getElementById("entry"),site=document.getElementById("site"),formLang=document.getElementById("formLang");
const daysEl=document.getElementById("days"),hoursEl=document.getElementById("hours"),minutesEl=document.getElementById("minutes"),secondsEl=document.getElementById("seconds");
let lang=localStorage.getItem("mf-editorial-lang")||"fr";
function setLang(l){if(!T[l])l="fr";lang=l;root.lang=l;root.dir=l==="ar"?"rtl":"ltr";if(formLang)formLang.value=l;document.querySelectorAll("[data-i18n]").forEach(el=>{const v=T[l][el.dataset.i18n];if(v!=null)el.textContent=v});document.querySelectorAll("[data-lang]").forEach(b=>b.classList.toggle("is-active",b.dataset.lang===l));localStorage.setItem("mf-editorial-lang",l)}
document.querySelectorAll("[data-lang]").forEach(b=>b.addEventListener("click",()=>setLang(b.dataset.lang)));

document.getElementById("openInvitation").addEventListener("click",()=>{
 entry.classList.add("opening");
 const reduced=matchMedia("(prefers-reduced-motion: reduce)").matches;
 setTimeout(()=>{entry.classList.add("leaving");site.classList.add("visible");site.setAttribute("aria-hidden","false");body.classList.remove("locked");setTimeout(()=>entry.hidden=true,reduced?10:650)},reduced?20:2050);
});

document.querySelectorAll("[data-scroll]").forEach(b=>b.addEventListener("click",()=>document.querySelector(b.dataset.scroll)?.scrollIntoView({behavior:"smooth"})));

function tick(){
 const target=new Date("2027-05-25T00:00:00+01:00").getTime();
 const d=Math.max(0,target-Date.now()),s=Math.floor(d/1000);
 daysEl.textContent=String(Math.floor(s/86400)).padStart(3,"0");
 hoursEl.textContent=String(Math.floor(s%86400/3600)).padStart(2,"0");
 minutesEl.textContent=String(Math.floor(s%3600/60)).padStart(2,"0");
 secondsEl.textContent=String(s%60).padStart(2,"0");
}
tick();setInterval(tick,1000);

const reveals=[...document.querySelectorAll(".reveal")];
if("IntersectionObserver"in window&&!matchMedia("(prefers-reduced-motion: reduce)").matches){const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add("visible");io.unobserve(e.target)}}),{threshold:.12});reveals.forEach(el=>io.observe(el))}else reveals.forEach(el=>el.classList.add("visible"));

const modal=document.getElementById("rsvpModal"),open=document.getElementById("openRsvp"),closeBtns=[...document.querySelectorAll("[data-close-modal]")];
let lastFocus=null;
function openModal(){lastFocus=document.activeElement;modal.hidden=false;body.style.overflow="hidden";setTimeout(()=>modal.querySelector(".modal-close").focus(),10)}
function closeModal(){modal.hidden=true;body.style.overflow="";lastFocus?.focus()}
open.addEventListener("click",openModal);closeBtns.forEach(b=>b.addEventListener("click",closeModal));document.addEventListener("keydown",e=>{if(e.key==="Escape"&&!modal.hidden)closeModal()});

const form=document.getElementById("rsvpForm"),steps=[...form.querySelectorAll(".rsvp-step")],dots=[...form.querySelectorAll(".step-dots i")],prev=document.getElementById("rsvpPrev"),next=document.getElementById("rsvpNext"),submit=document.getElementById("rsvpSubmit");let step=0;
function render(){steps.forEach((s,i)=>{s.hidden=i!==step;s.classList.toggle("active",i===step)});dots.forEach((d,i)=>d.classList.toggle("active",i<=step));prev.hidden=step===0;next.hidden=step===steps.length-1;submit.hidden=step!==steps.length-1}
function valid(){for(const c of steps[step].querySelectorAll("input,textarea,select"))if(!c.checkValidity()){c.reportValidity();return false}return true}
next.addEventListener("click",()=>{if(!valid())return;step=Math.min(step+1,steps.length-1);render()});prev.addEventListener("click",()=>{step=Math.max(0,step-1);render()});
render();setLang(lang);
})();