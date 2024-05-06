const { errorResponder, errorTypes } = require('../../../core/errors');
const authenticationServices = require('./authentication-service');
const Upayalogin = {}; // Inisialisasi objek kosong untuk menyimpan percobaan login dan data terkait

/**
 * Handle login request
 * @param {object} request - Express request object
 * @param {object} response - Express response object
 * @param {object} next - Express route middlewares
 * @returns {object} Response object or pass an error to the next route
 */

async function login(request, response, next) {
  const { email, password } = request.body;
  let UL = Upayalogin[email]?.attempts || 0; // Ambil jumlah percobaan login untuk alamat email tertentu atau atur ke 0 jika tidak ada
  const WaktuDetik = 60; // Rentang waktu percobaan login kembali (Detik), bisa diatur sesuai keinginan
  const LG = Upayalogin[email]?.LG || 0; // Ambil waktu terakhir login gagal untuk alamat email tertentu atau atur ke 0 jika tidak ada

  try {
    if (UL >= 5) {
      // Maksimal mencoba login apabila salah password adalah sebanyak 2 kali (bisa diatur sesuai keinginan)

      // Hitung waktu yang telah berlalu sejak percobaan login terakhir
      const waktuBerlalu = (Date.now() - LG) / 1000;

      if (waktuBerlalu < 30 * WaktuDetik) {
        throw errorResponder(
          errorTypes.Terlalu_Banyak_Melakukan_Login,
          'Terlalu banyak memasukan password dan Email login yang salah. Silakan coba lagi nanti setelah 30 menit!'
        );
      } else {
        UL = 0; //reset kembali jumlah percobaan login ke 0 setelah melebihi batas waktu
      }
    }

    const loginSuccess = await authenticationServices.checkLoginCredentials(
      email,
      password
    );

    // Jika autentikasi gagal, tambahkan jumlah percobaan login dan perbarui waktu terakhir login gagal
    if (!loginSuccess) {
      Upayalogin[email] = {
        attempts: UL + 1,
        LG: Date.now(),
      };

      throw errorResponder(
        errorTypes.INVALID_CREDENTIALS,
        'Wrong email or password'
      );
    }

    Upayalogin[email] = null; //reset jumlah percobaan login kembali menjadi 0 setelah berhasil login

    return response.status(200).json(loginSuccess);
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  login,
};
