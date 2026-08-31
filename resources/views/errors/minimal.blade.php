@extends('errors.layout')

@section('title', ($exception->getStatusCode() ?? 'Galat') . ' - Kendala Sistem')
@section('code', $exception->getStatusCode() ?? 'Error')
@section('badge', 'Kendala Sistem')
@section('heading', 'Terjadi Kendala pada Permintaan Anda')
@section('message', $exception->getMessage() ?: 'Permintaan Anda tidak dapat diproses secara sempurna oleh sistem saat ini.')

@section('suggestions')
    <li>Coba muat ulang halaman atau kembali ke halaman beranda.</li>
    <li>Periksa koneksi internet dan coba beberapa saat lagi.</li>
    <li>Hubungi pengelola sistem jika kendala berlanjut.</li>
@endsection
