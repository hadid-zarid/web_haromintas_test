@extends('errors.layout')

@section('title', '500 - Gangguan Server')
@section('code', '500')
@section('badge', 'Gangguan Server')
@section('heading', 'Terjadi Kendala Teknis pada Server')
@section('message', 'Sistem mengalami kendala pemrosesan tak terduga. Tim teknis HARMONITAS telah mencatat peristiwa ini untuk segera ditangani.')

@section('suggestions')
    <li>Coba muat ulang halaman dalam beberapa saat.</li>
    <li>Kembali ke halaman Beranda untuk melanjutkan aktivitas lainnya.</li>
    <li>Laporkan ke administrator jika kendala terus berulang.</li>
@endsection
