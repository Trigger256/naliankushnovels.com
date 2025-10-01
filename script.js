
// Data for novels - edit this list when adding your actual novels.
const novels = [
  {
    id: "novel-1",
    title: "Shadows Over Kampala",
    author: "Nalian Kush",
    price: "UGX 15,000",
    cover: "assets/cover1.png",
    filename: "novel-shadows-over-kampala.pdf"
  },
  {
    id: "novel-2",
    title: "Echoes of the Nile",
    author: "Nalian Kush",
    price: "UGX 12,000",
    cover: "assets/cover2.png",
    filename: "novel-echoes-of-the-nile.pdf"
  }
];

function init() {
  const list = document.getElementById('novel-list');
  if(!list) return;
  novels.forEach(n=>{
    const card = document.createElement('div');
    card.className = 'novel-card';
    card.innerHTML = `
      <img src="${n.cover}" alt="${n.title}">
      <div class="novel-meta">
        <h3>${n.title}</h3>
        <p class="small">by ${n.author}</p>
        <p class="price">${n.price}</p>
        <p class="small">Pay to: +256 784 380 775 or +256 762 548 826 (Mobile Money)</p>
        <div style="margin-top:10px;">
          <a class="btn" href="#" onclick="startPayment('${n.title}')">Buy — Pay Now</a>
          <a class="btn btn-alt" href="#" onclick="paidEmail('${n.title}')">I Paid — Send Proof</a>
        </div>
      </div>
    `;
    list.appendChild(card);
  });
}

function startPayment(title){
  alert('Pay using Mobile Money to one of the numbers shown. After payment, click "I Paid — Send Proof".');
}

function paidEmail(title){
  const buyerEmail = prompt('Enter your email to receive the download link:');
  if(!buyerEmail) return;
  const tx = prompt('Enter your Mobile Money Transaction ID (or phone number used to pay):');
  if(!tx) return;
  const subject = encodeURIComponent(`Purchase proof — ${title} — ${tx}`);
  const body = encodeURIComponent(`Hello Nalian Kush team,%0D%0A%0D%0AI have paid for "${title}".%0D%0ATransaction ID / Phone used: ${tx}%0D%0AMy email: ${buyerEmail}%0D%0A%0D%0APlease verify and send the download link.%0D%0A%0D%0ARegards,`);
  const to = encodeURIComponent('nathantumwesigye89@gmail.com, olivestrigger256@gmail.com');
  window.location.href = `mailto:${to}?subject=${subject}&body=${body}`;
}

// Init when DOM ready
document.addEventListener('DOMContentLoaded', init);
