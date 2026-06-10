// Inisialisasi data dari LocalStorage atau array kosong jika belum ada data
let expenses = JSON.parse(localStorage.getItem('expenses')) || [];

// DOM Elements
const expenseForm = document.getElementById('expense-form');
const dateInput = document.getElementById('date');
const itemInput = document.getElementById('item');
const amountInput = document.getElementById('amount');
const expenseList = document.getElementById('expense-list');
const filterMonth = document.getElementById('filter-month');
const monthlyTotalDisplay = document.getElementById('monthly-total');

// Set default tanggal hari ini pada input formulir dan filter bulan
const today = new Date();
dateInput.value = today.toISOString().split('T')[0];
filterMonth.value = today.toISOString().slice(0, 7); // Format: YYYY-MM

// Fungsi format mata uang Rupiah
function formatRupiah(number) {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0
    }).format(number);
}

// Menampilkan data ke tabel dan memperbarui rekapitulasi bulanan
function renderData() {
    // 1. Bersihkan tabel
    expenseList.innerHTML = '';
    
    // Urutkan pengeluaran berdasarkan tanggal terbaru
    expenses.sort((a, b) => new Date(b.date) - new Date(a.date));

    // 2. Isi tabel riwayat pengeluaran
    expenses.forEach((expense) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${expense.date}</td>
            <td>${expense.item}</td>
            <td>${formatRupiah(expense.amount)}</td>
            <td><button class="btn-delete" onclick="deleteExpense('${expense.id}')">Hapus</button></td>
        `;
        expenseList.appendChild(row);
    });

    // 3. Hitung Rekapitulasi Bulanan
    calculateMonthlyTotal();
}

// Fungsi menghitung total berdasarkan bulan yang dipilih
function calculateMonthlyTotal() {
    const selectedMonth = filterMonth.value; // Format: "YYYY-MM"
    
    if (!selectedMonth) {
        monthlyTotalDisplay.textContent = formatRupiah(0);
        return;
    }

    const total = expenses
        .filter(expense => expense.date.startsWith(selectedMonth))
        .reduce((sum, expense) => sum + expense.amount, 0);

    monthlyTotalDisplay.textContent = formatRupiah(total);
}

// Event saat formulir dikirim (Tambah Data)
expenseForm.addEventListener('submit', function(e) {
    e.preventDefault();

    const newExpense = {
        id: Date.now().toString(), // Generate unique ID
        date: dateInput.value,
        item: itemInput.value,
        amount: parseInt(amountInput.value)
    };

    expenses.push(newExpense);
    
    // Simpan ke LocalStorage
    localStorage.setItem('expenses', JSON.stringify(expenses));
    
    // Reset form input (kecuali tanggal)
    itemInput.value = '';
    amountInput.value = '';
    
    // Render ulang UI
    renderData();
});

// Fungsi menghapus item pengeluaran
function deleteExpense(id) {
    if (confirm('Apakah Anda yakin ingin menghapus catatan ini?')) {
        expenses = expenses.filter(expense => expense.id !== id);
        localStorage.setItem('expenses', JSON.stringify(expenses));
        renderData();
    }
}

// Event listener saat filter bulan diubah
filterMonth.addEventListener('change', calculateMonthlyTotal);

// Jalankan fungsi render pertama kali saat halaman dimuat
renderData();