


function hourly(score) {
    if(score < 1000)
        return 50
    else if(score >= 1000 && score < 10000)
        return 100
    else if(score >= 10000 && score < 100000)
        return 250
    else if(score >= 100000 && score < 1000000)
        return 500
    else if(score >= 1000000 && score < 10000000)
        return 1200
    else if(score >= 1000000)
        return 5000
}

function daily(score) {
    if(score < 1000)
        return 250
    else if(score >= 1000 && score < 10000)
        return 500
    else if(score >= 10000 && score < 100000)
        return 800
    else if(score >= 100000 && score < 1000000)
        return 2400
    else if(score >= 1000000 && score < 10000000)
        return 4000
    else if(score >= 1000000)
        return 7500
}

function weekly(score) {
    if(score < 1000)
        return 400
    else if(score >= 1000 && score < 10000)
        return 800
    else if(score >= 10000 && score < 100000)
        return 2400
    else if(score >= 100000 && score < 1000000)
        return 8000
    else if(score >= 1000000 && score < 10000000)
        return 20000
    else if(score >= 1000000)
        return 40000
}

module.exports = {hourly, daily, weekly};