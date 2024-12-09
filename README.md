# Pardus Flight Computer
A script for the online game [Pardus](https://www.pardus.at/) to provide navigational assistance.

## About

- Works in Firefox or Chrome
- Requires the [Tampermonkey](https://tampermonkey.net/) add-on

## Installation

Make sure you've installed the [Tampermonkey](https://tampermonkey.net/) add-on for your browser of choice. Open the [pardus_flight_computer.user.js](https://github.com/Tro95/Pardus-Flight-Computer/raw/main/pardus_flight_computer.user.js) raw file, and install the script into Tampermonkey.

## Using the script

Flight Computer will provide navigational assistance on the Nav page, and equivalent page for squads. By default, both path highlighting and route highlighting will be enabled, although no route will be programmed.

### Path highlighting

Path highlighting shows you the immediate tiles the game's in-built autopilot will cause your ship (or squad) to fly over, if you were to click on the tile under the mouse.

![Path highlighting demo](https://github.com/Tro95/Pardus-Flight-Computer/blob/main/static/path_highlighting.gif)

### Route highlighting

Route highlighting shows you a programmed route on the Nav screen. The route can be programmed either using the [route calculator](#RouteCalculator), or by configuring the tiles to highlight in the route highlighting configuration options. The route can include tiles from multiple sectors, and even be disjoint.

![Route highlighting demo](https://github.com/Tro95/Pardus-Flight-Computer/blob/main/static/route_highlighting.gif)

### Route calculator

The route calculator can be opened from the Nav screen using the configured key (default `d`), and allows you to plot the most AP-efficient route from your current location to your desired location. Select the desired sector to travel to, enter the co-ordinates, and click the 'Plot route' button at the bottom. Calculating the route may take up to 15 seconds, and requires connecting to an external website (https://pardusapcalculator.uk).

Favourites can be stored by selecting the sector, entering the desired co-ordinates, naming a favourite preset and clicking the corresponding 'Save' button. Favourites can be loaded by clicking the corresponding 'Load' button. The number of favourite presets can be adjusted in the Options configuration.

When you first install the script, and any time your equipment or navigation skill changes, you should hit the 'Refresh' button to ensure the script identifies your current equipment and skills correctly. If you do not do this, the route calculated may not be the most AP-efficient route possible.

![Route calculator](https://github.com/Tro95/Pardus-Flight-Computer/blob/main/static/route_calculator.png)

### Autopilot

The autopilot allows you to fly along a programmed route in either direction, including through wormholes, x-holes, and y-holes. To use the autopilot, you must be on a tile in the programmed route, and the programmed route must be both continuous (i.e., no gaps) and not repeat any tiles. Using the [route calculator](#RouteCalculator) guarantees this.

To fly along a programmed route, press the configured key for flying (default `f`). To change direction, such as when you reach one end of the route, press the configured key for changing direction (default `c`). The autopilot will not land on visible NPCs, even if they are non-hostile or you have a relevant orbiter, instead stopping one tile before the NPC. NPCs that are not visible, such as being cloaked or under a building, will not be avoided.

### Modifying a route

Should you wish to amend a programmed route, such as to avoid an NPC that is currently on the route, you are able to modify the route from the Nav screen. Route modification is only possible when the newly-modified section both starts and ends somewhere on the existing route, and cannot be used to extend the existing route beyond its ends. 

To modify a programmed route:
1. Start with your ship on the existing route
2. Press the configured modify route key (default `m`)
3. Manually click the new route you wish to take, ensuring your ship ends back on the existing route
4. Press the configured modify route key again (default `m`).

![Route modification demo](https://github.com/Tro95/Pardus-Flight-Computer/blob/main/static/route_modification.gif)

## Configuring the script

Options for configuring the script can be found in Pardus' in-game Options page.

![Options page](https://github.com/Tro95/Pardus-Flight-Computer/blob/main/static/options.png)
