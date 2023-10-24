import { NextResponse } from 'next/server';

export function middleware(request) {
    const url = request.nextUrl.clone();
    let isAdminLoggedIn = request.cookies.get("adminActivite");
    let isUserLoggedIn = request.cookies.get("userActivite");
    let isMechLoggedIn = request.cookies.get("mechActivite");

    if (!isAdminLoggedIn && url.pathname.startsWith('/admin')) {
        return NextResponse.rewrite(new URL('/login', request.url));
    }

    if (!isUserLoggedIn && url.pathname.startsWith('/home')) {
        return NextResponse.rewrite(new URL('/login', request.url));
    }

    if (!isMechLoggedIn && url.pathname.startsWith('/mechDashBoard')) {
        return NextResponse.rewrite(new URL('/login', request.url));
    }

    if (isAdminLoggedIn && (url.pathname === '/' || url.pathname === '/login' || url.pathname === '/register' || url.pathname === '/mechDashBoard' || url.pathname === '/home')) {
        url.pathname = '/admin';
        return NextResponse.redirect(url);
    }

    if (isUserLoggedIn && (url.pathname === '/' || url.pathname === '/login' || url.pathname === '/register' || url.pathname === '/mechDashBoard' || url.pathname === '/admin')) {
        url.pathname = '/home';
        return NextResponse.redirect(url);
    }

    if (isMechLoggedIn && (url.pathname === '/' || url.pathname === '/login' || url.pathname === '/register' || url.pathname === '/home' || url.pathname === '/admin')) {
        url.pathname = '/mechDashBoard';
        return NextResponse.redirect(url);
    }


    // if (url.pathname.startsWith('/api')) {
    //     return NextResponse.rewrite(new URL('/login', request.url));
    // }
}
