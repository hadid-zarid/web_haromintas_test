@extends('errors.layout')

@section('title', '404 - Halaman Tidak Ditemukan')
@section('code', '404')
@section('badge', 'Halaman Tidak Ditemukan')
@section('heading', 'Halaman yang Anda Tuju Tidak Ditemukan')
@section('message', 'Tautan URL yang Anda tuju mungkin salah ketik, telah dipindahkan ke arsip lain, atau sudah tidak tersedia dalam sistem HARMONITAS.')

@section('suggestions')
    <li>Periksa kembali penulisan alamat URL pada browser Anda.</li>
    <li>Gunakan fitur pencarian pada menu Daftar Berkas Regulasi.</li>
    <li>Kembali ke Beranda atau gunakan menu navigasi utama.</li>
@endsection
