@extends('errors.layout')

@section('title', '429 - Terlalu Banyak Permintaan')
@section('code', '429')
@section('badge', 'Batas Permintaan Terlampaui')
@section('heading', 'Terlalu Banyak Permintaan Terkirim')
@section('message', 'Sistem mendeteksi aktivitas pengiriman permintaan yang terlalu cepat dari perangkat Anda demi melindungi stabilitas server.')

@section('suggestions')
    <li>Tunggu sekitar 1–2 menit sebelum mencoba mengirim permintaan kembali.</li>
    <li>Hindari menekan tombol aksi berulang kali dalam waktu singkat.</li>
    <li>Muat ulang halaman jika waktu tunggu telah selesai.</li>
@endsection
