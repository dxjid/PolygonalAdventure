# PolygonalAdventure
The **Polygonal Adventure** is a game made within the course of Interactive Graphics with purpose to realize the famous river crossing mathematical puzzle. Within the environment, the user is called to transport the Wolf, the Sheep and Cabbage across the river using the bridge but there are certain constraints that the user has to take into account. To begin with the user can transport only one of the aforementioned characters at a time. Also if Wolf is left alone with Sheep he eats it and if Sheep is left alone with Cabbage he eats it too. There are many forms of this mathematical puzzle, usually different characters but their purpose is always the same to introduce one with the fact of mathematical constraints and persuade them to solve the given problem.


# Folder Structure

|-- Branch 			# This folder holds the changes that haven't been released
|---- Document_to_present
|---- JSON			# Contains the meshes to import as json files
|---- Source			# Source files to run game
|---- meshes			# Blender files
|---- soundeffects		# Music used in the game
|-- Trunk			# All changes that have been released
|---- Document_to_present
|---- JSON			# Contains the meshes to import as json files
|---- Source			# Source files to run game
|---- meshes			# Blender files
|---- soundeffects		# Music used in the game

# How to run

The source files are in html and javascript so to run the game is only needed a local server; python provides a local server in its libraries, the command to execute it is the next:

En Mac y Linux
'python -m SimpleHTTPServer'

Windows
'python -m http.server'
