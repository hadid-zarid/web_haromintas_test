@extends('errors.layout')

@section('title', '419 - Sesi Kedaluwarsa')
@section('code', '419')
@section('badge', 'Sesi Berakhir')
@section('heading', 'Token Keamanan Formulir Telah Kedaluwarsa')
@section('message', 'Sesi keamanan (CSRF Token) halaman Anda telah habis masa berlakunya demi menjaga keamanan transaksi data Anda.')

@section('suggestions')
    <li>Muat ulang halaman untuk memperbarui token keamanan.</li>
    <li>Kirim kembali formulir setelah halaman selesai dimuat ulang.</li>
    <li>Masuk kembali ke akun Anda jika sesi login telah berakhir.</li>
@endsection
