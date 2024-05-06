const { mutasi } = require('../../../models');

/**
 * Get a list of mutasis
 * @returns {Promise}
 * @param {object} qq
 */
async function getmutasis() {
  return User.find({});
}

/**
 * Get mutasis detail
 * @param {string} id - User ID
 * @returns {Promise}
 */
async function getmutasi(id) {
  return User.findById(id);
}

//soal no 1 tentang Paginationdan Filter
//fungsi untuk Sort dan Search
async function getUsers({ Nomorpage, sortBy, Ukuranpage, searchBy }) {
  let qq = {}; //objek menyimpan kriteria pencarian

  let MelakukanPemilihan = {}; //Menginisialisasi objek kosong untuk menyimpan kriteria pengurutan
  //Jika sortBy disediakan, pisahkan menjadi bidang dan urutan
  if (sortBy) {
    const [Gagal, order] = sortBy.split(':');
    MelakukanPemilihan = { [Gagal]: order === 'desc' ? -1 : 1 };
  } else {
    MelakukanPemilihan = { _id: 1 };
  }

  const saluran = [{ $match: qq }, { $sort: MelakukanPemilihan }];

  const Skiip = (Nomorpage - 1) * Ukuranpage; //Menghitung nilai skip berdasarkan nomor halaman dan ukuran halaman
  if (Ukuranpage !== null) {
    saluran.push({ $skip: Skiip });
    saluran.push({ $limit: Ukuranpage });
  }
  //Menambahkan tahap proyeksi ke alur
  saluran.push({
    $project: {
      id: '$_id', //memproyeksikan id
      name: 1, //memunculkan kolom name
      email: 1, //memunculkan kolom email
      _id: 0, //Menghilangkan kolom _id
    },
  });
  //Jika searchBy disediakan, tambahkan kriteria pencarian
  if (searchBy) {
    const [Gagal, keyword] = searchBy.split(':');
    qq[Gagal] = { $regex: keyword, $options: 'i' };
  }
  const count = await User.countDocuments(qq); //menghitung total dokumen sesuai dengan kriteria pencarian

  const users = await User.aggregate(saluran); // Mengambil data pengguna  yang telah disusun

  return { count, users }; // Mengembalikan objek yang berisi jumlah pengguna dan daftar pengguna yang sesuai
}

/**
 * Create new mutasi
 * @param {string}type
 * @param {string} Dari_acount
 * @param {string}To_acount
 * @param {string}amount
 * @param {string}description
 * @returns {Promise}
 */
async function createmutasi(type, Dari_acount, To_acount, amount, description) {
  return User.create({
    type,
    Dari_acount,
    To_acount,
    amount,
    description,
  });
}

/**
 * Update existing mutasi
 * @param {string}type
 * @param {string} Dari_acount
 * @param {string}To_acount
 * @param {string}amount
 * @param {string}description
 * @returns {Promise}
 */
async function updatemutasi(type, Dari_acount, To_acount, amount, description) {
  return User.updateOne(
    {
      _id: id,
    },
    {
      $set: {
        type,
        Dari_acount,
        To_acount,
        amount,
        description,
      },
    }
  );
}

/**
 * Delete a mutasi
 * @param {string} id -mutasi ID
 * @returns {Promise}
 */
async function deletemutasi(id) {
  return mutasi.deleteOne({ _id: id });
}

module.exports = {
  getmutasis,
  getmutasi,
  createmutasi,
  updatemutasi,
  deletemutasi,
};
