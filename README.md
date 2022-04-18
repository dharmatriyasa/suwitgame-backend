Penjelasan Flow User:
1. User harus register dulu sebelum main. Disini aku make 'username', 'name', dan 'password' sebagai input. Ednpoint: http://localhost:5000/register
2. Setelah register, user dapat melakukan login dengan inputan 'username' dan 'password'. Endpoint: http://localhost:5000/login
3. Setelah itu user dapat membuat room (syarat harus login terlebih dahulu). Inputan dalam membuat room yaitu 'roomName'. Setelah itu akan muncul roomId yang digunakan untuk bermain game Endpoint: http://localhost:5000/api/v1/create-room
4. Sebelum user lain dapat bermain mereka harus join room dulu melalui Endpoint: http://localhost:5000/api/v1/join-room/:id . Dengan ':id' sesuai dengan id yang didapatkan dari user pada langkah 3
5. Setelah itu baru permainan dapat dimulai dimana satu game terdapat 3 ronde. Ini melalui Endpoint: http://localhost:5000/api/v1/fight/:id dengan ':id' adalah id yang didapat dari langkah 3. Pada bagian ini, input yang diperlukan hanya 'playerSelect' dengan inputan 'P','R', atau 'S'. Input harus dilakukan secara bergantian dari user 1 dilanjutkan dengan user 2 sebanyak 3 kali (round). Pada input user 2 di ronde terakhir akan sekalian generate hasil dari round tersebut.

Penjelasan Admin:
1. Untuk admin saya buat endpoint registernya soalnya biar gampang input ke databasenya mas WKWKK
2. terus login endpointnya juga berbeda.