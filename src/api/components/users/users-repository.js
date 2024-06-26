const { User } = require('../../../models');

/**
 * Get a list of users
 * @returns {Promise}
 * @param {object} qq
 */
async function getUsers() {
  return User.find({});
}

/**
 * Get user detail
 * @param {string} id - User ID
 * @returns {Promise}
 */
async function getUser(id) {
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
 * Create new user
 * @param {string} name - Name
 * @param {string} email - Email
 * @param {string} password - Hashed password
 * @returns {Promise}
 */
async function createUser(name, email, password) {
  return User.create({
    name,
    email,
    password,
  });
}

/**
 * Update existing user
 * @param {string} id - User ID
 * @param {string} name - Name
 * @param {string} email - Email
 * @returns {Promise}
 */
async function updateUser(id, name, email) {
  return User.updateOne(
    {
      _id: id,
    },
    {
      $set: {
        name,
        email,
      },
    }
  );
}

/**
 * Delete a user
 * @param {string} id - User ID
 * @returns {Promise}
 */
async function deleteUser(id) {
  return User.deleteOne({ _id: id });
}

/**
 * Get user by email to prevent duplicate email
 * @param {string} email - Email
 * @returns {Promise}
 */
async function getUserByEmail(email) {
  return User.findOne({ email });
}

/**
 * Update user password
 * @param {string} id - User ID
 * @param {string} password - New hashed password
 * @returns {Promise}
 */
async function changePassword(id, password) {
  return User.updateOne({ _id: id }, { $set: { password } });
}

module.exports = {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  getUserByEmail,
  changePassword,
};
