const DAY = 86400000;
const PLAN_VALIDITY = 30 * DAY;

let balance = parseInt(localStorage.getItem("balance")) || 0;
let plan = JSON.parse(localStorage.getItem("plan"));
let adsWatched = parseInt(localStorage.getItem("adsWatched")) || 0;
let lastAds = parseInt(localStorage.getItem("lastAds")) || 0;
let selectedAmount = 0;

const signedUp = localStorage.getItem("signedUp");

const plansData = [
 {price:500, earn:5},{price:1000, earn:10},{price:2000, earn:20},
 {price:3000, earn:30},{price:5000, earn:50},{price:7000, earn:70},
 {price:10000, earn:100},{price:15000, earn:150},
 {price:20000, earn:200},{price:30000, earn:300}
];

if(signedUp){
  showMain();
}else{
  showSignup();
}

function showSignup(){
  document.getElementById("signup").classList.add("active");
  document.getElementById("mainHeader").style.display="none";
  document.getElementById("nav").style.display="none";
}

function showMain(){
  document.getElementById("signup").style.display="none";
  document.getElementById("mainHeader").style.display="block";
  document.getElementById("nav").style.display="flex";
  document.getElementById("balance").innerText=balance;
  openPage("home");
  checkPlanExpiry();
  renderPlans();
}

function signup(){
  if(!sname.value || !sphone.value) return alert("Fill all fields");
  localStorage.setItem("signedUp","yes");
  showMain();
}

function logout(){
  if(!confirm("Logout?")) return;
  localStorage.clear();
  location.reload();
}

function openPage(id){
  document.querySelectorAll(".page").forEach(p=>p.classList.remove("active"));
  document.getElementById(id).classList.add("active");
  if(id==="ads") document.getElementById("watched").innerText=adsWatched;
}

function renderPlans(){
  const div=document.getElementById("plans");
  div.innerHTML="";
  plansData.forEach(p=>{
    let c=document.createElement("div");
    c.className="card";
    c.innerHTML=`
      <h4>Plan Rs ${p.price}</h4>
      <p>Daily Ads: 10</p>
      <p>Earning / Ad: Rs ${p.earn}</p>
      <p><b>Validity: 30 Days</b></p>
    `;
    if(plan && plan.price===p.price){
      c.innerHTML+=`
        <p style="color:green"><b>PLAN ACTIVATED</b></p>
        <button onclick="openPage('ads')">Watch Ads</button>
        <button class="cancel" onclick="cancelPlan()">Cancel Plan</button>
      `;
    }else{
      c.innerHTML+=`<button onclick="buyPlan(${p.price},${p.earn})">Buy Plan</button>`;
    }
    div.appendChild(c);
  });
}

function selectAmount(a){selectedAmount=a;alert("Selected Rs "+a)}

function confirmDeposit(){
  if(!trx.value) return alert("Enter TRX ID");
  balance+=selectedAmount;
  localStorage.setItem("balance",balance);
  document.getElementById("balance").innerText=balance;
  alert("Deposit Successful");
}

function buyPlan(price,earn){
  if(plan) return alert("Cancel current plan first");
  if(balance<price) return alert("Insufficient balance");
  balance-=price;
  plan={price,earn,start:Date.now()};
  adsWatched=0;
  localStorage.setItem("plan",JSON.stringify(plan));
  localStorage.setItem("balance",balance);
  localStorage.setItem("adsWatched",0);
  renderPlans();
}

function cancelPlan(){
  localStorage.removeItem("plan");
  localStorage.removeItem("adsWatched");
  localStorage.removeItem("lastAds");
  plan=null;
  adsWatched=0;
  renderPlans();
}

function checkPlanExpiry(){
  if(plan && Date.now()-plan.start>PLAN_VALIDITY){
    cancelPlan();
    alert("Plan expired");
  }
}

function watchAd(){
  if(!plan) return alert("No active plan");
  if(Date.now()-lastAds>DAY) adsWatched=0;
  if(adsWatched>=10) return alert("Daily ads completed");

  let s=5;
  watchBtn.disabled=true;
  let t=setInterval(()=>{
    timer.innerText="Watching ad... "+s+"s";
    s--;
    if(s<0){
      clearInterval(t);
      adsWatched++;
      balance+=plan.earn;
      lastAds=Date.now();
      localStorage.setItem("adsWatched",adsWatched);
      localStorage.setItem("lastAds",lastAds);
      localStorage.setItem("balance",balance);
      document.getElementById("balance").innerText=balance;
      watched.innerText=adsWatched;
      timer.innerText="Ad completed ✔";
      watchBtn.disabled=false;
    }
  },1000);
}

function withdraw(){
  let amt=parseInt(wAmount.value);
  if(amt<200) return alert("Minimum withdraw amount not selected");
  if(balance<amt) return alert("Insufficient balance");
  let code=Math.floor(1000000000+Math.random()*9000000000);
  balance-=amt;
  localStorage.setItem("balance",balance);
  document.getElementById("balance").innerText=balance;
  withdrawResult.innerHTML=
   `<b>Withdraw Code:</b> ${code}<br>
    Amount: Rs ${amt}<br><br>
    <b style="color:red">
    CLICK THE SCREENSHOT OF THIS PAGE AND SEND TO WHATSAPP 03352475828
    </b>`;
}
