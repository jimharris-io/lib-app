export const Server = {
    DEVELOPMENT: "lib-app",
    STAGING: "lib-production",
    PRODUCTION: "everyones-library"
}

export const version = {
    "lib-app": { // development
        release: "0.9.3",
        show: true,
        dismiss: 0,
        cheatMode: true
    },
    "lib-production": { // staging
        release: "0.9.3",
        show: true,
        dismiss: 0,
        cheatMode: true
    },
    "everyones-library": { // production
        release: "0.9.3",
        show: true,
        dismiss: 10,
        cheatMode: true
    },
}

export const colours = [
    {
        label: "Yellow",
        hex: "#fef864",
        value: 0,
        borderColor: "#fef864"
    },
    {
        label: "Green",
        hex: "#0ae6b4",
        value: 1,
        borderColor: "#0ae6b4"
    },
    {
        label: "Orange",
        hex: "#ff6446",
        value: 2,
        borderColor: "#ff6446"
    },
    {
        label: "Lilac",
        hex: "#ba99ff",
        value: 3,
        borderColor: "#ba99ff"
    },
    {
        label: "Navy blue",
        hex: "#4d2beb",
        value: 4,
        borderColor: "#4d2beb"
    },
    {
        label: "Black",
        hex: "#000000",
        value: 5,
        borderColor: "#666666"
    },
    {
        label: "White",
        hex: "#ffffff",
        value: 6,
        borderColor: "#d3d3d3"
    }
]

export const shapes = [
    {
        label: "Square",
        value: 0,
        path: `M47.9498564,28 C36.9309964,28 28,36.9309964 28,47.9498564 L28,302.501189 C28,313.520049 36.9309964,322.451045 47.9498564,322.451045 L302.501189,322.451045 C313.520049,322.451045 322.451045,313.520049 322.451045,302.501189 L322.451045,47.9498564 C322.451045,36.9309964 313.520049,28 302.501189,28 L47.9498564,28 Z`,
        textArea: {
            left: 12,
            top: 12,
            width: 0.76,
            height: 0.76
        }
    },
    {
        label: "Circle",
        value: 1,
        path: `M175.000944,335 C263.367028,335 335.001888,263.36514 335.001888,175.000944 C335.001888,86.6348599 263.367028,15 175.000944,15 C86.6348599,15 15,86.6348599 15,175.000944 C15,263.36514 86.6348599,335 175.000944,335`,
        textArea: {
            left: 19,
            top: 19,
            width: 0.62,
            height: 0.62
        }
    },
    {
        label: "Heart",
        value: 2,
        path: `M335,124.411114 C335.216948,73.0526932 296.398081,31.6069044 248.294014,31.84 C230.27457,31.9278237 213.513678,37.8553927 199.583178,47.9341477 C184.936077,58.5301492 165.578858,58.5244859 150.870541,48.0247602 C137.064276,38.168761 120.427618,32.4582845 102.494598,32.5451215 C54.3923316,32.7792038 15.2205655,74.600657 15,125.959078 C14.8838712,153.663856 26.138822,178.469033 44.0736429,195.419237 L144.232082,290.685087 C160.998376,306.631003 186.295458,306.672534 203.106764,290.779475 L304.590375,194.84347 C323.095955,177.706378 334.878454,152.493444 335,124.411114`,
        textArea: {
            left: 13,
            top: 18,
            width: .74,
            height: .354
        }
    },
    {
        label: "Rosette",
        value: 3,
        path: `M178.191458,38.0573085 L212.616664,15.9874968 C215.708816,14.0053479 219.833573,15.1115757 221.519344,18.3717387 L240.298789,54.6979201 C241.416343,56.8631818 243.692982,58.1770633 246.126306,58.0637977 L286.973675,56.1628225 C290.641594,55.9929241 293.662011,59.0114536 293.492113,62.6793729 L291.591138,103.528629 C291.477872,105.961953 292.791754,108.236705 294.955128,109.356147 L331.281309,128.133704 C334.54336,129.821362 335.6477,133.946119 333.667439,137.036384 L311.595739,171.463478 C310.281858,173.513586 310.281858,176.141349 311.595739,178.191458 L333.667439,212.616664 C335.6477,215.708816 334.54336,219.833573 331.281309,221.519344 L294.955128,240.298789 C292.791754,241.416343 291.477872,243.692982 291.591138,246.124418 L293.492113,286.973675 C293.662011,290.641594 290.641594,293.662011 286.973675,293.490225 L246.126306,291.591138 C243.692982,291.477872 241.416343,292.791754 240.298789,294.955128 L221.519344,331.281309 C219.833573,334.54336 215.708816,335.6477 212.616664,333.667439 L178.191458,311.595739 C176.141349,310.281858 173.513586,310.281858 171.463478,311.595739 L137.036384,333.667439 C133.946119,335.6477 129.821362,334.54336 128.135592,331.281309 L109.356147,294.955128 C108.236705,292.791754 105.961953,291.477872 103.528629,291.591138 L62.6793729,293.490225 C59.0114536,293.662011 55.9929241,290.641594 56.1628225,286.973675 L58.0637977,246.124418 C58.1770633,243.692982 56.8631818,241.416343 54.6998079,240.298789 L18.3717387,221.519344 C15.1115757,219.833573 14.0053479,215.708816 15.9874968,212.616664 L38.0573085,178.191458 C39.37119,176.141349 39.37119,173.513586 38.0573085,171.463478 L15.9874968,137.036384 C14.0053479,133.946119 15.1115757,129.821362 18.3717387,128.133704 L54.6998079,109.356147 C56.8631818,108.236705 58.1770633,105.961953 58.0637977,103.528629 L56.1628225,62.6793729 C55.9929241,59.0114536 59.0114536,55.9929241 62.6793729,56.1628225 L103.528629,58.0637977 C105.961953,58.1770633 108.236705,56.8631818 109.356147,54.6979201 L128.135592,18.3717387 C129.821362,15.1115757 133.946119,14.0053479 137.036384,15.9874968 L171.463478,38.0573085 C173.513586,39.37119 176.141349,39.37119 178.191458,38.0573085`,
        textArea: {
            left: 19,
            top: 19,
            width: 0.62,
            height: 0.62
        }
    },
]

export const fonts = [
    {
        label: "Typeface 01",
        className: "typeface-1",
        lineHeight: 1,
        value: 0
    },
    {
        label: "Typeface 02",
        className: "typeface-2",
        lineHeight: 1,
        value: 1
    }
]

export const adminMessageLength = 140;

export const pagelength = 25;

export const confirmationTimeout = 15;

export const randomMessages = [
    "like to pop in for a coffee and read the paper",
    "I go there every night after school",
    "my writer's reatreat",
    "it's quiet and cosy",
    "It's a good place to find new music",
    "EVERYONE'S LIBRARY",
    "I go there to study as I don't have space at home.",
    "Having access to books I can't afford is really important"
];

export const SortOrder = {
    ASCENDING: "ascending",
    DESCENDING: "descending"
}

export const SortBy = {
    DATE: "date",
    NAME: "name",
    FAVOURITE: "favourite"
}

export const Internal = {
    WAKE_WALL: "wake_wall",
    RESET_WAKE: "reset_wake",
    NONE: "none"
}

export const grids = [
    {
        width: 5,
        height: 3,
        column: 4,
        row: 4,
        threshold: 8
    },
    {
        width: 7,
        height: 5,
        column: 3,
        row: 3,
        threshold: 19
    },
    {
        width: 9,
        height: 7,
        column: 2,
        row: 2,
        threshold: 29
    },
    {
        width: 11,
        height: 9,
        column: 1,
        row: 1,
        threshold: 49
    },
    {
        width: 13,
        height: 11,
        column: 0,
        row: 0,
        threshold: 83
    }
]

export const walks = [
    [
        { // 1
            column: 6,
            row: 5,
            grid: 0
        },
        { // 2
            column: 7,
            row: 5,
            grid: 0
        },
        { // 3
            column: 8,
            row: 5,
            grid: 0
        },
        { // 4
            column: 6,
            row: 6,
            grid: 0
        },
        { // 5
            column: 6,
            row: 4,
            grid: 0
        },
        { // 6
            column: 7,
            row: 4,
            grid: 0
        },
        { // 7
            column: 5,
            row: 5,
            grid: 0
        },
        { // 8
            column: 4,
            row: 5,
            grid: 0
        },
        { // 9
            column: 3,
            row: 6,
            grid: 1
        },
        { // 10
            column: 4,
            row: 6,
            grid: 1
        },
        { // 11
            column: 5,
            row: 6,
            grid: 1
        },
        { // 12
            column: 6,
            row: 3,
            grid: 1
        },
        { // 13
            column: 7,
            row: 3,
            grid: 1
        },
        { // 14
            column: 8,
            row: 3,
            grid: 1
        },
        { // 15
            column: 8,
            row: 4,
            grid: 1
        },
        { // 16
            column: 9,
            row: 4,
            grid: 1
        },
        { // 17
            column: 9,
            row: 5,
            grid: 1
        },
        { // 18
            column: 8,
            row: 6,
            grid: 1
        },
        { // 19
            column: 5,
            row: 7,
            grid: 1
        },
        { // 20
            column: 5,
            row: 8,
            grid: 2
        },
        { // 21
            column: 6,
            row: 8,
            grid: 2
        },
        { // 22
            column: 7,
            row: 8,
            grid: 2
        },
        { // 23
            column: 6,
            row: 2,
            grid: 2
        },
        { // 24
            column: 7,
            row: 2,
            grid: 2
        },
        { // 25
            column: 8,
            row: 2,
            grid: 2
        },
        { // 26
            column: 10,
            row: 5,
            grid: 2
        },
        { // 27
            column: 10,
            row: 6,
            grid: 2
        },
        { // 28
            column: 5,
            row: 2,
            grid: 2
        },
        { // 29
            column: 4,
            row: 2,
            grid: 2
        },
        { // 30
            column: 5,
            row: 1,
            grid: 3
        },
        { // 31
            column: 4,
            row: 1,
            grid: 3
        },
        { // 32
            column: 2,
            row: 7,
            grid: 3
        },
        { // 33
            column: 10,
            row: 4,
            grid: 3
        },
        { // 34
            column: 10,
            row: 3,
            grid: 3
        },
        { // 35
            column: 10,
            row: 2,
            grid: 3
        },
        { // 36
            column: 11,
            row: 2,
            grid: 3
        },
        { // 37
            column: 4,
            row: 9,
            grid: 3
        },
        { // 38
            column: 5,
            row: 9,
            grid: 3
        },
        { // 39
            column: 6,
            row: 9,
            grid: 3
        },
        { // 40
            column: 11,
            row: 7,
            grid: 3
        },
        { // 41
            column: 10,
            row: 7,
            grid: 3
        },
        { // 42
            column: 9,
            row: 7,
            grid: 3
        },
        { // 43
            column: 8,
            row: 7,
            grid: 3
        },
        { // 44
            column: 4,
            row: 3,
            grid: 3
        },
        { // 45
            column: 3,
            row: 3,
            grid: 3
        },
        { // 46
            column: 2,
            row: 5,
            grid: 3
        },
        { // 47
            column: 1,
            row: 5,
            grid: 3
        },
        { // 48
            column: 2,
            row: 6,
            grid: 3
        },
        { // 49
            column: 1,
            row: 6,
            grid: 3
        },
        { // 50
            column: 0,
            row: 6,
            grid: 4
        },
        { // 51
            column: 0,
            row: 5,
            grid: 4
        },
        { // 52
            column: 0,
            row: 4,
            grid: 4
        },
        { // 53
            column: 5,
            row: 0,
            grid: 4
        },
        { // 54
            column: 4,
            row: 0,
            grid: 4
        },
        { // 55
            column: 3,
            row: 0,
            grid: 4
        },
        { // 56
            column: 7,
            row: 1,
            grid: 4
        },
        { // 57
            column: 7,
            row: 0,
            grid: 4
        },
        { // 58
            column: 8,
            row: 0,
            grid: 4
        },
        { // 59
            column: 9,
            row: 0,
            grid: 4
        },
        { // 60
            column: 10,
            row: 0,
            grid: 4
        },
        { // 61
            column: 10,
            row: 1,
            grid: 4
        },
        { // 62
            column: 9,
            row: 1,
            grid: 4
        },
        { // 63
            column: 11,
            row: 5,
            grid: 4
        },
        { // 64
            column: 11,
            row: 4,
            grid: 4
        },
        { // 65
            column: 12,
            row: 4,
            grid: 4
        },
        { // 66
            column: 12,
            row: 3,
            grid: 4
        },
        { // 67
            column: 12,
            row: 2,
            grid: 4
        },
        { // 68
            column: 12,
            row: 7,
            grid: 4
        },
        { // 69
            column: 7,
            row: 10,
            grid: 4
        },
        { // 70
            column: 8,
            row: 10,
            grid: 4
        },
        { // 71
            column: 9,
            row: 10,
            grid: 4
        },
        { // 72
            column: 5,
            row: 10,
            grid: 4
        },
        { // 73
            column: 4,
            row: 10,
            grid: 4
        },
        { // 74
            column: 3,
            row: 10,
            grid: 4
        },
        { // 75
            column: 11,
            row: 1,
            grid: 4
        },
        { // 76
            column: 11,
            row: 0,
            grid: 4
        },
        { // 77
            column: 12,
            row: 0,
            grid: 4
        },
        { // 78
            column: 2,
            row: 3,
            grid: 4
        },
        { // 79
            column: 2,
            row: 4,
            grid: 4
        },
        { // 80
            column: 0,
            row: 3,
            grid: 4
        },
        { // 81
            column: 1,
            row: 3,
            grid: 4
        },
        { // 82
            column: 3,
            row: 9,
            grid: 4
        },
        { // 83
            column: 3,
            row: 8,
            grid: 4
        }
    ]
]