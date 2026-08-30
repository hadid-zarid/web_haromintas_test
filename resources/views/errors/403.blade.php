@extends('errors.layout')

@section('title', '403 - Akses Ditolak')
@section('code', '403')
@section('badge', 'Akses Ditolak')
@section('heading', 'Anda Tidak Memiliki Izin untuk Mengakses Halaman Ini')
@section('message', 'Akun Anda tidak memiliki hak akses atau peran yang sesuai untuk membuka menu/berkas ini. Beberapa fitur khusus dibatasi untuk Tim Kerja atau Administrator.')

@section('suggestions')
    <li>Pastikan Anda telah masuk dengan akun yang memiliki peran sesuai.</li>
    <li>Fitur Draft Generate Surat hanya dapat diakses oleh peran Tim Kerja.</li>
    <li>Hubungi Administrator Kanwil Kemenkumham Riau jika membutuhkan bantuan hak akses.</li>
@endsection
