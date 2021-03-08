function get_sector_coords(tile_id) {
    for (const index in sectorMapDataObj) {
        const sector = sectorMapDataObj[index];
        if (tile_id >= sector.start && tile_id < sector.start + (sector.cols * sector.rows)) {
            return `${index} [${Math.floor((tile_id - sector.start) / sector.rows)}, ${(tile_id - sector.start) % sector.rows}]`;
        }
    }
}

function get_sector_coords_obj(tile_id) {
    for (const index in sectorMapDataObj) {
        const sector = sectorMapDataObj[index];
        if (tile_id >= sector.start && tile_id < sector.start + (sector.cols * sector.rows)) {
            return {
                'sector': index,
                'x': Math.floor((tile_id - sector.start) / sector.rows),
                'y': (tile_id - sector.start) % sector.rows
            }
        }
    }
}

/* return the tile id given the current sector name and coordinates */
function getTileIdFromSectorAndCoords(sector, x, y) {

    if (sector.endsWith('NE')) {
        sector = sector.substring(0, sector.length - 3);
    }

    if (sector.endsWith('East') || sector.endsWith('West')) {
        sector = sector.substring(0, sector.length - 5);
    }

    if (sector.endsWith('North') || sector.endsWith('South') || sector.endsWith('Inner')) {
        sector = sector.substring(0, sector.length - 6);
    }

    if (!sectorMapDataObj[sector]) {
        throw `No data for sector '${sector}'!`;
    }

    let sectorData = sectorMapDataObj[sector];
    
    if (x < 0 || y < 0 || x >= sectorData.cols || y >= sectorData.rows) {
        return -1;
    }

    return Number(sectorData.start) + Number(x) * Number(sectorData.rows) + Number(y);
}

const sectorMapDataObj = {
    "Alpha Centauri" : { "start": 1, "cols": 19, "rows": 12 },
    "Andexa" : { "start": 229, "cols": 20, "rows": 15 },
    "Beta Proxima" : { "start": 529, "cols": 19, "rows": 19 },
    "BL 3961" : { "start": 890, "cols": 20, "rows": 10 },
    "Cesoho" : { "start": 1090, "cols": 12, "rows": 7 },
    "Daceess" : { "start": 1174, "cols": 15, "rows": 8 },
    "Epsilon Eridani" : { "start": 1294, "cols": 18, "rows": 32 },
    "Ericon" : { "start": 1870, "cols": 15, "rows": 26 },
    "Faexze" : { "start": 2260, "cols": 23, "rows": 16 },
    "Hoanda" : { "start": 2628, "cols": 16, "rows": 18 },
    "Lalande" : { "start": 2916, "cols": 7, "rows": 10 },
    "Lave" : { "start": 2986, "cols": 23, "rows": 16 },
    "Miarin" : { "start": 3354, "cols": 7, "rows": 20 },
    "Olexti" : { "start": 3494, "cols": 8, "rows": 16 },
    "Ook" : { "start": 3622, "cols": 15, "rows": 15 },
    "Orerve" : { "start": 3847, "cols": 18, "rows": 15 },
    "PJ 3373" : { "start": 4117, "cols": 10, "rows": 6 },
    "Quurze" : { "start": 4177, "cols": 16, "rows": 20 },
    "SA 2779" : { "start": 4497, "cols": 16, "rows": 5 },
    "Siberion" : { "start": 4577, "cols": 25, "rows": 15 },
    "Sol" : { "start": 4952, "cols": 24, "rows": 29 },
    "Tau Ceti" : { "start": 5648, "cols": 25, "rows": 15 },
    "WP 3155" : { "start": 6023, "cols": 17, "rows": 7 },
    "XH 3819" : { "start": 6142, "cols": 16, "rows": 12 },
    "ZZ 2986" : { "start": 6334, "cols": 15, "rows": 5 },
    "Adaa" : { "start": 6409, "cols": 22, "rows": 26 },
    "An Dzeve" : { "start": 6981, "cols": 23, "rows": 18 },
    "IP 3-251" : { "start": 7395, "cols": 16, "rows": 9 },
    "Canaab" : { "start": 7539, "cols": 18, "rows": 13 },
    "Kenlada" : { "start": 7773, "cols": 25, "rows": 20 },
    "Edeneth" : { "start": 8273, "cols": 12, "rows": 7 },
    "Exinfa" : { "start": 8357, "cols": 10, "rows": 20 },
    "Grecein" : { "start": 8557, "cols": 13, "rows": 16 },
    "Iceo" : { "start": 8765, "cols": 20, "rows": 14 },
    "Inliaa" : { "start": 9045, "cols": 12, "rows": 10 },
    "Lamice" : { "start": 9165, "cols": 25, "rows": 22 },
    "Lianla" : { "start": 9715, "cols": 20, "rows": 20 },
    "Miayack" : { "start": 10115, "cols": 24, "rows": 14 },
    "Olbea" : { "start": 10451, "cols": 21, "rows": 22 },
    "Phicanho" : { "start": 10913, "cols": 13, "rows": 25 },
    "PO 4-991" : { "start": 11238, "cols": 20, "rows": 14 },
    "Quana" : { "start": 11518, "cols": 16, "rows": 26 },
    "RV 2-578" : { "start": 11934, "cols": 14, "rows": 12 },
    "Sigma Draconis" : { "start": 12102, "cols": 25, "rows": 20 },
    "Ska" : { "start": 12602, "cols": 40, "rows": 25 },
    "Tiexen" : { "start": 13602, "cols": 19, "rows": 20 },
    "Urandack" : { "start": 13982, "cols": 20, "rows": 15 },
    "VH 3-344" : { "start": 14282, "cols": 8, "rows": 16 },
    "Waiophi" : { "start": 14410, "cols": 17, "rows": 15 },
    "XC 3-261" : { "start": 14665, "cols": 16, "rows": 13 },
    "Zeolen" : { "start": 14873, "cols": 15, "rows": 12 },
    "Pass EMP-01" : { "start": 15053, "cols": 20, "rows": 25 },
    "Pass EMP-02" : { "start": 15553, "cols": 18, "rows": 20 },
    "Pass FED-01" : { "start": 15913, "cols": 18, "rows": 17 },
    "Pass FED-02" : { "start": 16219, "cols": 13, "rows": 19 },
    "Anaam" : { "start": 16466, "cols": 18, "rows": 20 },
    "Ayargre" : { "start": 16826, "cols": 18, "rows": 18 },
    "Beethti" : { "start": 17150, "cols": 16, "rows": 20 },
    "Begreze" : { "start": 17470, "cols": 17, "rows": 14 },
    "Canexin" : { "start": 17708, "cols": 25, "rows": 25 },
    "Datiack" : { "start": 18333, "cols": 19, "rows": 15 },
    "Edbeeth" : { "start": 18618, "cols": 18, "rows": 15 },
    "Edmize" : { "start": 18888, "cols": 16, "rows": 16 },
    "Faphida" : { "start": 19144, "cols": 22, "rows": 14 },
    "Grefaho" : { "start": 19452, "cols": 21, "rows": 20 },
    "Laolla" : { "start": 20240, "cols": 12, "rows": 17 },
    "Olphize" : { "start": 20858, "cols": 19, "rows": 21 },
    "QW 2-014" : { "start": 21257, "cols": 15, "rows": 9 },
    "Retho" : { "start": 21392, "cols": 22, "rows": 22 },
    "Soessze" : { "start": 21876, "cols": 20, "rows": 20 },
    "TG 2-143" : { "start": 22276, "cols": 11, "rows": 12 },
    "Tiacken" : { "start": 22408, "cols": 19, "rows": 28 },
    "Urhoho" : { "start": 22940, "cols": 18, "rows": 18 },
    "Usube" : { "start": 23264, "cols": 14, "rows": 30 },
    "Zamith" : { "start": 23684, "cols": 18, "rows": 18 },
    "Zirr" : { "start": 24008, "cols": 25, "rows": 18 },
    "Ackandso" : { "start": 24458, "cols": 26, "rows": 20 },
    "Aeg" : { "start": 24978, "cols": 21, "rows": 13 },
    "Besoex" : { "start": 25251, "cols": 13, "rows": 16 },
    "Cassand" : { "start": 25459, "cols": 13, "rows": 19 },
    "Daurlia" : { "start": 25706, "cols": 14, "rows": 15 },
    "Delta Pavonis" : { "start": 25916, "cols": 14, "rows": 27 },
    "Eta Cassiopeia" : { "start": 26294, "cols": 15, "rows": 35 },
    "Exackcan" : { "start": 26819, "cols": 15, "rows": 13 },
    "Fomalhaut" : { "start": 27014, "cols": 20, "rows": 20 },
    "Greandin" : { "start": 27414, "cols": 14, "rows": 23 },
    "Iniolol" : { "start": 27736, "cols": 17, "rows": 14 },
    "Keldon" : { "start": 27974, "cols": 26, "rows": 34 },
    "KU 3-616" : { "start": 28858, "cols": 12, "rows": 8 },
    "Laanex" : { "start": 28954, "cols": 15, "rows": 16 },
    "LN 3-141" : { "start": 29194, "cols": 6, "rows": 6 },
    "PI 4-669" : { "start": 29230, "cols": 9, "rows": 10 },
    "Pollux" : { "start": 29320, "cols": 20, "rows": 10 },
    "Quator" : { "start": 29520, "cols": 18, "rows": 18 },
    "Regulus" : { "start": 29844, "cols": 16, "rows": 16 },
    "SZ 4-419" : { "start": 30100, "cols": 12, "rows": 7 },
    "Tianbe" : { "start": 30184, "cols": 19, "rows": 15 },
    "Urlafa" : { "start": 30469, "cols": 17, "rows": 16 },
    "Vewaa" : { "start": 30741, "cols": 22, "rows": 15 },
    "WG 3-288" : { "start": 31071, "cols": 9, "rows": 13 },
    "Wolf" : { "start": 31188, "cols": 18, "rows": 20 },
    "Zezela" : { "start": 31548, "cols": 14, "rows": 10 },
    "Pass EMP-03" : { "start": 31688, "cols": 25, "rows": 20 },
    "Ackexa" : { "start": 32188, "cols": 20, "rows": 15 },
    "Alioth" : { "start": 32488, "cols": 16, "rows": 15 },
    "Bedaho" : { "start": 32728, "cols": 20, "rows": 18 },
    "Betelgeuse" : { "start": 33088, "cols": 32, "rows": 22 },
    "Capella" : { "start": 33792, "cols": 19, "rows": 17 },
    "Epsilon Indi" : { "start": 34115, "cols": 20, "rows": 13 },
    "Essaa" : { "start": 34375, "cols": 11, "rows": 22 },
    "Famiay" : { "start": 34617, "cols": 15, "rows": 13 },
    "GV 4-652" : { "start": 34812, "cols": 12, "rows": 12 },
    "HC 4-962" : { "start": 34956, "cols": 12, "rows": 13 },
    "Inena" : { "start": 35112, "cols": 14, "rows": 21 },
    "JS 2-090" : { "start": 35406, "cols": 13, "rows": 10 },
    "LO 2-014" : { "start": 35536, "cols": 10, "rows": 3 },
    "Maia" : { "start": 35566, "cols": 20, "rows": 13 },
    "Micanex" : { "start": 35826, "cols": 20, "rows": 20 },
    "Nebul" : { "start": 36226, "cols": 12, "rows": 26 },
    "Nionquat" : { "start": 36538, "cols": 15, "rows": 20 },
    "Omicron Eridani" : { "start": 36838, "cols": 16, "rows": 19 },
    "Phekda" : { "start": 37142, "cols": 8, "rows": 17 },
    "Rashkan" : { "start": 37278, "cols": 25, "rows": 29 },
    "Sohoa" : { "start": 38003, "cols": 14, "rows": 16 },
    "Tiacan" : { "start": 38227, "cols": 15, "rows": 18 },
    "Waayan" : { "start": 38497, "cols": 25, "rows": 16 },
    "YC 3-268" : { "start": 38897, "cols": 14, "rows": 15 },
    "Zeaex" : { "start": 39107, "cols": 12, "rows": 14 },
    "Pass FED-03" : { "start": 39275, "cols": 17, "rows": 15 },
    "Pass FED-04" : { "start": 39530, "cols": 25, "rows": 22 },
    "Pass FED-05" : { "start": 40080, "cols": 21, "rows": 21 },
    "Pass FED-06" : { "start": 40521, "cols": 18, "rows": 23 },
    "Betiess" : { "start": 40935, "cols": 13, "rows": 16 },
    "BQ 3-927" : { "start": 41143, "cols": 15, "rows": 15 },
    "Canopus" : { "start": 41368, "cols": 13, "rows": 22 },
    "Daaya" : { "start": 41654, "cols": 26, "rows": 25 },
    "Electra" : { "start": 42304, "cols": 23, "rows": 16 },
    "Enaness" : { "start": 42672, "cols": 21, "rows": 12 },
    "Famiso" : { "start": 42924, "cols": 22, "rows": 15 },
    "Hocancan" : { "start": 43254, "cols": 17, "rows": 19 },
    "Laedgre" : { "start": 43577, "cols": 19, "rows": 20 },
    "Miphimi" : { "start": 43957, "cols": 22, "rows": 18 },
    "Nex 0002" : { "start": 44353, "cols": 20, "rows": 25 },
    "Olcanze" : { "start": 44853, "cols": 20, "rows": 20 },
    "Phiagre" : { "start": 45253, "cols": 21, "rows": 13 },
    "Remo" : { "start": 45526, "cols": 28, "rows": 26 },
    "Ross" : { "start": 46254, "cols": 17, "rows": 15 },
    "SD 3-562" : { "start": 46509, "cols": 23, "rows": 19 },
    "Ururur" : { "start": 46946, "cols": 20, "rows": 17 },
    "WO 3-290" : { "start": 47286, "cols": 17, "rows": 11 },
    "Nex Kataam" : { "start": 47473, "cols": 25, "rows": 25 },
    "HO 2-296" : { "start": 48098, "cols": 15, "rows": 11 },
    "Iozeio" : { "start": 48263, "cols": 19, "rows": 13 },
    "Mizar" : { "start": 51715, "cols": 16, "rows": 23 },
    "AN 2-956" : { "start": 52083, "cols": 19, "rows": 20 },
    "Becanin" : { "start": 52463, "cols": 17, "rows": 14 },
    "Cabard" : { "start": 52701, "cols": 9, "rows": 22 },
    "Cemiess" : { "start": 52899, "cols": 18, "rows": 15 },
    "Encea" : { "start": 53169, "cols": 14, "rows": 15 },
    "Exbeur" : { "start": 53379, "cols": 25, "rows": 25 },
    "Facece" : { "start": 54004, "cols": 16, "rows": 23 },
    "GM 4-572" : { "start": 54372, "cols": 15, "rows": 13 },
    "Lahola" : { "start": 54567, "cols": 25, "rows": 21 },
    "Nex 0003" : { "start": 55092, "cols": 25, "rows": 20 },
    "Ophiuchi" : { "start": 55592, "cols": 22, "rows": 20 },
    "Paan" : { "start": 56032, "cols": 25, "rows": 23 },
    "Quince" : { "start": 56607, "cols": 14, "rows": 16 },
    "Sodaack" : { "start": 56831, "cols": 15, "rows": 16 },
    "Tiliala" : { "start": 57071, "cols": 25, "rows": 17 },
    "Urioed" : { "start": 57496, "cols": 21, "rows": 9 },
    "Veareth" : { "start": 57685, "cols": 19, "rows": 25 },
    "Waarze" : { "start": 58160, "cols": 20, "rows": 14 },
    "ZP 2-989" : { "start": 58440, "cols": 13, "rows": 14 },
    "Pass EMP-04" : { "start": 58622, "cols": 25, "rows": 25 },
    "Pass EMP-05" : { "start": 59247, "cols": 13, "rows": 20 },
    "Aandti" : { "start": 78435, "cols": 22, "rows": 13 },
    "Anphiex" : { "start": 78721, "cols": 18, "rows": 30 },
    "Atlas" : { "start": 79261, "cols": 21, "rows": 15 },
    "Baar" : { "start": 79576, "cols": 16, "rows": 12 },
    "Becanol" : { "start": 79768, "cols": 20, "rows": 25 },
    "BL 6-511" : { "start": 80268, "cols": 24, "rows": 31 },
    "Edenve" : { "start": 81012, "cols": 25, "rows": 25 },
    "Faarfa" : { "start": 81637, "cols": 14, "rows": 12 },
    "Gilo" : { "start": 81805, "cols": 18, "rows": 21 },
    "Hooth" : { "start": 82183, "cols": 25, "rows": 13 },
    "Ioquex" : { "start": 82508, "cols": 16, "rows": 15 },
    "Lasolia" : { "start": 82748, "cols": 19, "rows": 16 },
    "Nex 0001" : { "start": 83052, "cols": 23, "rows": 25 },
    "Polaris" : { "start": 83627, "cols": 10, "rows": 14 },
    "Qumia" : { "start": 83767, "cols": 20, "rows": 15 },
    "Solaqu" : { "start": 84067, "cols": 25, "rows": 25 },
    "UZ 8-466" : { "start": 84692, "cols": 20, "rows": 13 },
    "Waolex" : { "start": 84952, "cols": 25, "rows": 25 },
    "Zelada" : { "start": 85577, "cols": 14, "rows": 20 },
    "Pass FED-07" : { "start": 85857, "cols": 27, "rows": 15 },
    "Adara" : { "start": 95219, "cols": 15, "rows": 21 },
    "Alfirk" : { "start": 95534, "cols": 20, "rows": 15 },
    "Diphda" : { "start": 95834, "cols": 20, "rows": 20 },
    "EH 5-382" : { "start": 96234, "cols": 14, "rows": 15 },
    "HW 3-863" : { "start": 96444, "cols": 16, "rows": 20 },
    "Kitalpha" : { "start": 96764, "cols": 17, "rows": 16 },
    "Mebsuta" : { "start": 97036, "cols": 17, "rows": 20 },
    "Nex 0004" : { "start": 97376, "cols": 25, "rows": 25 },
    "Nusakan" : { "start": 98001, "cols": 25, "rows": 19 },
    "Phao" : { "start": 98476, "cols": 21, "rows": 20 },
    "Rotanev" : { "start": 98896, "cols": 16, "rows": 19 },
    "Seginus" : { "start": 99200, "cols": 17, "rows": 18 },
    "Thabit" : { "start": 99506, "cols": 25, "rows": 25 },
    "Wasat" : { "start": 100131, "cols": 25, "rows": 19 },
    "Yildun" : { "start": 100606, "cols": 14, "rows": 17 },
    "Zaniah" : { "start": 100844, "cols": 16, "rows": 16 },
    "Zuben Elakrab" : { "start": 101100, "cols": 25, "rows": 17 },
    "Ackwada" : { "start": 101525, "cols": 22, "rows": 15 },
    "Aveed" : { "start": 101855, "cols": 17, "rows": 15 },
    "Beta Hydri" : { "start": 102110, "cols": 24, "rows": 20 },
    "CP 2-197" : { "start": 102590, "cols": 16, "rows": 13 },
    "Dainfa" : { "start": 102798, "cols": 18, "rows": 18 },
    "Daured" : { "start": 103122, "cols": 18, "rows": 17 },
    "DI 9-486" : { "start": 103428, "cols": 25, "rows": 16 },
    "Edethex" : { "start": 103828, "cols": 25, "rows": 25 },
    "Exiool" : { "start": 104453, "cols": 22, "rows": 19 },
    "Gretiay" : { "start": 104871, "cols": 20, "rows": 20 },
    "Ioliaa" : { "start": 105271, "cols": 18, "rows": 16 },
    "Liaququ" : { "start": 105559, "cols": 17, "rows": 24 },
    "Menkent" : { "start": 105967, "cols": 20, "rows": 17 },
    "Naos" : { "start": 106307, "cols": 17, "rows": 18 },
    "Quexce" : { "start": 106613, "cols": 19, "rows": 24 },
    "Sophilia" : { "start": 107069, "cols": 24, "rows": 17 },
    "Spica" : { "start": 107477, "cols": 20, "rows": 23 },
    "Urfaa" : { "start": 107937, "cols": 23, "rows": 20 },
    "Vega" : { "start": 108857, "cols": 30, "rows": 25 },
    "Wainze" : { "start": 109607, "cols": 17, "rows": 16 },
    "YV 3-386" : { "start": 109879, "cols": 12, "rows": 18 },
    "Zaurak" : { "start": 110095, "cols": 17, "rows": 27 },
    "DH 3-625" : { "start": 110554, "cols": 16, "rows": 13 },
    "Pass EMP-06" : { "start": 110762, "cols": 25, "rows": 13 },
    "Pass UNI-01" : { "start": 111087, "cols": 25, "rows": 16 },
    "Pass UNI-02" : { "start": 111487, "cols": 10, "rows": 10 },
    "Pass UNI-03" : { "start": 111587, "cols": 18, "rows": 20 },
    "Achird" : { "start": 118538, "cols": 22, "rows": 22 },
    "BE 3-702" : { "start": 119022, "cols": 20, "rows": 20 },
    "Bellatrix" : { "start": 119422, "cols": 25, "rows": 18 },
    "Cebalrai" : { "start": 119872, "cols": 21, "rows": 24 },
    "Dsiban" : { "start": 120376, "cols": 17, "rows": 17 },
    "Furud" : { "start": 120665, "cols": 15, "rows": 20 },
    "Gienah Cygni" : { "start": 120965, "cols": 15, "rows": 26 },
    "Homam" : { "start": 121355, "cols": 17, "rows": 22 },
    "Izar" : { "start": 121729, "cols": 16, "rows": 18 },
    "Keid" : { "start": 122017, "cols": 20, "rows": 20 },
    "Lazebe" : { "start": 122417, "cols": 28, "rows": 19 },
    "Matar" : { "start": 122949, "cols": 16, "rows": 16 },
    "Nashira" : { "start": 123205, "cols": 24, "rows": 21 },
    "Nekkar" : { "start": 123709, "cols": 14, "rows": 24 },
    "Olaeth" : { "start": 124045, "cols": 18, "rows": 14 },
    "Phaet" : { "start": 124297, "cols": 17, "rows": 16 },
    "Sirius" : { "start": 124569, "cols": 30, "rows": 25 },
    "Subra" : { "start": 125319, "cols": 20, "rows": 20 },
    "Turais" : { "start": 125719, "cols": 20, "rows": 23 },
    "UG 5-093" : { "start": 126179, "cols": 22, "rows": 23 },
    "Wezen" : { "start": 126685, "cols": 20, "rows": 20 },
    "WW 2-934" : { "start": 127085, "cols": 16, "rows": 11 },
    "Pass UNI-04" : { "start": 127261, "cols": 25, "rows": 25 },
    "Pass UNI-05" : { "start": 127886, "cols": 25, "rows": 26 },
    "Nari" : { "start": 137155, "cols": 34, "rows": 37 },
    "Enif" : { "start": 138413, "cols": 35, "rows": 25 },
    "Baham" : { "start": 139288, "cols": 29, "rows": 36 },
    "Cebece" : { "start": 140332, "cols": 27, "rows": 18 },
    "Cor Caroli" : { "start": 140818, "cols": 40, "rows": 42 },
    "Dubhe" : { "start": 142498, "cols": 20, "rows": 25 },
    "Aya" : { "start": 142998, "cols": 40, "rows": 35 },
    "Etamin" : { "start": 144398, "cols": 31, "rows": 24 },
    "Fornacis" : { "start": 145142, "cols": 25, "rows": 30 },
    "Gomeisa" : { "start": 145892, "cols": 30, "rows": 23 },
    "Heze" : { "start": 146605, "cols": 35, "rows": 40 },
    "Labela" : { "start": 148005, "cols": 34, "rows": 38 },
    "Menkar" : { "start": 149297, "cols": 27, "rows": 34 },
    "Mintaka" : { "start": 150215, "cols": 40, "rows": 25 },
    "Pardus" : { "start": 151215, "cols": 100, "rows": 93 },
    "Nhandu" : { "start": 160515, "cols": 28, "rows": 40 },
    "Procyon" : { "start": 161635, "cols": 37, "rows": 31 },
    "Quaack" : { "start": 162782, "cols": 28, "rows": 25 },
    "Ras Elased" : { "start": 163482, "cols": 41, "rows": 40 },
    "Rigel" : { "start": 165122, "cols": 49, "rows": 34 },
    "Sargas" : { "start": 166788, "cols": 34, "rows": 25 },
    "Nunki" : { "start": 167638, "cols": 19, "rows": 27 },
    "Meram" : { "start": 168151, "cols": 20, "rows": 25 },
    "Ackarack" : { "start": 300000, "cols": 14, "rows": 20 },
    "Anayed" : { "start": 300280, "cols": 15, "rows": 16 },
    "Ayinti" : { "start": 300520, "cols": 20, "rows": 20 },
    "Beeday" : { "start": 300920, "cols": 16, "rows": 15 },
    "Belati" : { "start": 301160, "cols": 25, "rows": 16 },
    "CC 3-771" : { "start": 301560, "cols": 20, "rows": 10 },
    "DP 2-354" : { "start": 301760, "cols": 16, "rows": 14 },
    "Edvea" : { "start": 301984, "cols": 32, "rows": 24 },
    "Fawaol" : { "start": 302752, "cols": 20, "rows": 25 },
    "Greliai" : { "start": 303252, "cols": 16, "rows": 20 },
    "Hource" : { "start": 303572, "cols": 19, "rows": 16 },
    "Iowagre" : { "start": 303876, "cols": 18, "rows": 12 },
    "Miackio" : { "start": 304092, "cols": 25, "rows": 16 },
    "Oldain" : { "start": 304492, "cols": 18, "rows": 18 },
    "Quaphi" : { "start": 304816, "cols": 17, "rows": 14 },
    "RX 3-129" : { "start": 305054, "cols": 13, "rows": 12 },
    "Tiurio" : { "start": 305210, "cols": 25, "rows": 14 },
    "Watibe" : { "start": 305560, "cols": 21, "rows": 15 },
    "YS 3-386" : { "start": 305875, "cols": 14, "rows": 20 },
    "Zearla" : { "start": 306155, "cols": 17, "rows": 16 },
    "ZS 3-798" : { "start": 306427, "cols": 13, "rows": 20 },
    "Aedce" : { "start": 306687, "cols": 17, "rows": 20 },
    "Ayqugre" : { "start": 307027, "cols": 16, "rows": 14 },
    "Ceanze" : { "start": 307251, "cols": 15, "rows": 17 },
    "Enioar" : { "start": 307506, "cols": 21, "rows": 13 },
    "Faedho" : { "start": 307779, "cols": 14, "rows": 25 },
    "Hobeex" : { "start": 308129, "cols": 19, "rows": 14 },
    "Inioen" : { "start": 308395, "cols": 13, "rows": 14 },
    "JG 2-013" : { "start": 308577, "cols": 20, "rows": 8 },
    "Leesti" : { "start": 308737, "cols": 15, "rows": 16 },
    "Liaface" : { "start": 308977, "cols": 20, "rows": 20 },
    "Ollaffa" : { "start": 309377, "cols": 17, "rows": 14 },
    "Qumiin" : { "start": 309615, "cols": 18, "rows": 20 },
    "RA 3-124" : { "start": 309975, "cols": 12, "rows": 12 },
    "SF 5-674" : { "start": 310119, "cols": 13, "rows": 22 },
    "Soolti" : { "start": 310405, "cols": 21, "rows": 20 },
    "Tiafa" : { "start": 310825, "cols": 24, "rows": 27 },
    "UF 3-555" : { "start": 311473, "cols": 14, "rows": 14 },
    "Ureneth" : { "start": 311669, "cols": 18, "rows": 17 },
    "VM 3-326" : { "start": 311975, "cols": 25, "rows": 10 },
    "Wamien" : { "start": 312225, "cols": 25, "rows": 15 },
    "Xewao" : { "start": 312600, "cols": 16, "rows": 16 },
    "Pass EMP-07" : { "start": 312856, "cols": 25, "rows": 23 },
    "Pass EMP-08" : { "start": 313431, "cols": 25, "rows": 21 },
    "Pass EMP-09" : { "start": 313956, "cols": 25, "rows": 25 },
    "Pass EMP-10" : { "start": 314581, "cols": 25, "rows": 25 },
    "Pass EMP-11" : { "start": 315206, "cols": 15, "rows": 22 },
    "Pass FED-08" : { "start": 315536, "cols": 14, "rows": 23 },
    "Pass FED-09" : { "start": 315858, "cols": 23, "rows": 17 },
    "Pass FED-10" : { "start": 316249, "cols": 19, "rows": 20 },
    "Pass FED-11" : { "start": 316629, "cols": 22, "rows": 17 },
    "Pass FED-12" : { "start": 317003, "cols": 21, "rows": 22 },
    "Pass UNI-06" : { "start": 317465, "cols": 17, "rows": 19 },
    "Pass UNI-07" : { "start": 317788, "cols": 23, "rows": 24 },
    "Pass UNI-08" : { "start": 318340, "cols": 20, "rows": 31 },
    "Andsoled" : { "start": 318960, "cols": 18, "rows": 25 },
    "Beurso" : { "start": 319410, "cols": 19, "rows": 25 },
    "Ceina" : { "start": 319885, "cols": 16, "rows": 15 },
    "Daaze" : { "start": 320125, "cols": 17, "rows": 15 },
    "Edqueth" : { "start": 320380, "cols": 17, "rows": 10 },
    "Enwaand" : { "start": 320550, "cols": 20, "rows": 22 },
    "FR 3-328" : { "start": 320990, "cols": 12, "rows": 20 },
    "Ladaen" : { "start": 321230, "cols": 20, "rows": 23 },
    "Liaackti" : { "start": 321690, "cols": 20, "rows": 23 },
    "Oauress" : { "start": 322150, "cols": 22, "rows": 16 },
    "Phiandgre" : { "start": 322502, "cols": 24, "rows": 20 },
    "Quexho" : { "start": 322982, "cols": 17, "rows": 14 },
    "Stein" : { "start": 323220, "cols": 16, "rows": 16 },
    "Tivea" : { "start": 323476, "cols": 25, "rows": 20 },
    "Veedfa" : { "start": 323976, "cols": 14, "rows": 15 },
    "Canolin" : { "start": 324186, "cols": 16, "rows": 15 },
    "Nex 0005" : { "start": 324426, "cols": 25, "rows": 25 },
    "PP 5-713" : { "start": 325051, "cols": 15, "rows": 13 },
    "Sowace" : { "start": 325246, "cols": 19, "rows": 21 },
    "Abeho" : { "start": 325645, "cols": 25, "rows": 13 },
    "Arexack" : { "start": 325970, "cols": 17, "rows": 17 },
    "BU 5-773" : { "start": 326259, "cols": 25, "rows": 8 },
    "Dadaex" : { "start": 326459, "cols": 18, "rows": 21 },
    "Famida" : { "start": 326837, "cols": 25, "rows": 19 },
    "Gresoin" : { "start": 327312, "cols": 25, "rows": 21 },
    "GT 3-328" : { "start": 327837, "cols": 14, "rows": 16 },
    "Iohofa" : { "start": 328061, "cols": 24, "rows": 16 },
    "Lagreen" : { "start": 328445, "cols": 16, "rows": 20 },
    "Lavebe" : { "start": 328765, "cols": 23, "rows": 8 },
    "Let" : { "start": 328949, "cols": 22, "rows": 34 },
    "Miola" : { "start": 329697, "cols": 25, "rows": 19 },
    "Olaso" : { "start": 330172, "cols": 25, "rows": 20 },
    "PA 2-013" : { "start": 330672, "cols": 20, "rows": 17 },
    "Sobein" : { "start": 331012, "cols": 15, "rows": 12 },
    "Tigrecan" : { "start": 331192, "cols": 19, "rows": 13 },
    "Uressce" : { "start": 331439, "cols": 20, "rows": 17 },
    "Uv Seti" : { "start": 331779, "cols": 22, "rows": 15 },
    "Veliace" : { "start": 332109, "cols": 25, "rows": 16 },
    "WI 4-329" : { "start": 332509, "cols": 16, "rows": 21 },
    "Zeaay" : { "start": 332845, "cols": 27, "rows": 14 },
    "AB 5-848" : { "start": 375000, "cols": 18, "rows": 14 },
    "Algol" : { "start": 375252, "cols": 19, "rows": 25 },
    "Bewaack" : { "start": 375727, "cols": 14, "rows": 25 },
    "Cegreeth" : { "start": 376077, "cols": 18, "rows": 22 },
    "Edmial" : { "start": 376473, "cols": 17, "rows": 16 },
    "Elnath" : { "start": 376745, "cols": 18, "rows": 25 },
    "Fadaphi" : { "start": 377195, "cols": 25, "rows": 25 },
    "Greenso" : { "start": 377820, "cols": 20, "rows": 16 },
    "JO 4-132" : { "start": 378140, "cols": 20, "rows": 20 },
    "Miayda" : { "start": 378540, "cols": 25, "rows": 17 },
    "Nex 0006" : { "start": 378965, "cols": 25, "rows": 25 },
    "Oucanfa" : { "start": 379590, "cols": 15, "rows": 15 },
    "Propus" : { "start": 379815, "cols": 16, "rows": 20 },
    "Silaad" : { "start": 380135, "cols": 25, "rows": 20 },
    "Vecelia" : { "start": 380635, "cols": 15, "rows": 26 },
    "Xeho" : { "start": 381025, "cols": 16, "rows": 17 },
    "ZU 3-239" : { "start": 381297, "cols": 13, "rows": 22 },
    "Pass FED-13" : { "start": 381583, "cols": 16, "rows": 21 },
    "Pass UNI-09" : { "start": 381919, "cols": 20, "rows": 15 }
};
