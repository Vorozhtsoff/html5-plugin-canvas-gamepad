const getButtonsLayouts = (radius, colors) => ([
    [{
        x: 0,
        y: 0,
        r: radius,
        color: colors.red,
        name: 'a'
    }],
    [
        {
            x: -(radius / 4),
            y: radius + (radius / 2),
            r: radius,
            color: colors.red,
            name: 'a'
        },
        {
            x: (radius + (radius / 0.75)),
            y: -radius + (radius / 2),
            r: radius,
            color: colors.green,
            name: 'b'
        }
    ],
    [
        {
            x: -radius * 0.75,
            y: radius * 2,
            r: radius,
            color: colors.red,
            name: 'a'
        },
        {
            x: radius * 1.75,
            y: radius,
            r: radius,
            color: colors.green,
            name: 'b'
        },
        {
            x: radius * 3.5,
            y: -radius,
            r: radius,
            color: colors.blue,
            name: 'c'
        }
    ],
    [
        {
            x: -radius,
            y: radius,
            r: radius,
            color: colors.red,
            name: 'a'
        },
        {
            x: (radius * 2) - radius,
            y: -(radius + (radius)) + radius,
            r: radius,
            color: colors.green,
            name: 'b'
        },
        {
            x: (radius * 2) - radius,
            y: (radius + radius) + radius,
            r: radius,
            color: colors.blue,
            name: 'x'
        },
        {
            x: radius * 3,
            y: 0 + radius,
            r: radius,
            color: colors.purple,
            name: 'y'
        }
    ]
]);

export default getButtonsLayouts;
