import { NextResponse } from 'next/server';

export async function middleware (req) {
    console.log({first: "inside middleware"})
    // Extract the IP address from request headers
    const ip = req.headers.get('x-forwarded-for') || req.ip || '0.0.0.0';
    console.log({ firstIP: ip })

    // Mock or use a real service to map IP to location (use APIs or geo-databases)
    const geoInfo = await getRegionFromIP(ip); // Replace this with actual IP-to-region mapping logic
    console.log({ firstInfo: geoInfo })

    const currentDate = new Date();
    const currentHour = currentDate.getUTCHours(); // Get the current hour in UTC
    console.log({ firstDate: currentDate })

    // Check if the user is from a specific region and within a given time window
    if (geoInfo.region === 'desired-region' && currentHour >= specificStartTime && currentHour <= specificEndTime) {
        // Redirect the user to a different route
        return NextResponse.redirect(new URL('/another-path', req.url));
    }

    // Continue as normal if conditions aren't met
    return NextResponse.next();
}

async function getRegionFromIP(ip) {
    try {
        const response = await fetch(`https://ipinfo.io/${ip}/json`);
        const data = await response.json();
        return { region: data.region };
    } catch (error) {
        console.error('Error fetching IP info:', error);
        return { region: 'unknown' };
    }
}

