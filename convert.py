
datad = {
    'seismic': (
        (0.0, 0.0, 0.3), (0.0, 0.0, 1.0),
        (1.0, 1.0, 1.0), (1.0, 0.0, 0.0),
        (0.5, 0.0, 0.0)
    ),
    'bwr': ((0.0, 0.0, 1.0), (1.0, 1.0, 1.0), (1.0, 0.0, 0.0)),

}


if __name__ == '__main__':

    with open('outfile.js', 'w') as out:
        for name, data in datad.items():
            out.write('Colorbar.registerColorMap(\n')
            out.write(f"\t'{name}',\n")
            out.write('\t[\n')
            for rgb in data:
                out.write(f'\t\t[{round(255*rgb[0])}, {round(255*rgb[1])}, {round(255*rgb[2])}],\n')
            out.write('\t]\n')
            out.write(');\n')
            out.write('\n')
