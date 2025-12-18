0x91D281FF = lives (byte)
0x91D27FFF = level number (0 indexed, byte)
the game does not load the new level until you win, so if you change the level number, you have to win the current level first.


0x91CFABC4 = player x position (float) left border is -369. Right border is 369
0x91CFABCC = player y position (float) top border is -281.5 bottom border is 281.5
0x91CFABC0 = possible player struct base

0x91CFDD84 = single enemy x position (float)
0x91CFDD8C = single enemy y position (float)

0x91CFF64C = enemy 2 position x (float)
0x91CFF654 = enemy 2 position y (float)

0x91D00F14 = enemy 3 position x (float)
0x91D00F1C = enemy 3 position y (float)

0x91D027DC = enemy 4 position x (float)
0x91D027E4 = enemy 4 poisition y (float)
6344 bytes between enemy tanks

0x91D27EFF = number of enemies at start of level load
0x91CFAB8B = number of remaining enemies
    The game tracks this number. If it reaches 0, the level is won.

0x91CFDE6B = enemy tank 1 gui color (byte) 2 is brown.
0 -> player 1
1 -> player 2
2 -> brown
3 -> grey
4 -> turquoise
5 -> pink
6 -> yellow
7 -> purple
8 -> green
9 -> white / invisible
10 -> black

0x91CFE483 = bullet type (byte)
1, 2, 4, 5, 6
3 = blue
7 = green

0x91CFDE67 = enemy 1 lives 

0x91D1D2B3 = player mine count
0x91D1D2A3 = global mine count
0x91D1D2BB = possibly enemy 1 mine count
0x91D1D2BF = possibly enemy 2 mine count (might be enemy mine count)
91d1d2c7 = player 4 mine count
91d1d2cb = player 5 mine count

0x91D1455C = bullet 1 x address
0x91D144C4 = possible address for bullet1
0x91d1464C = possible address for bullet1

Dimensions based on where player can reach (blocks)
level 1: 22 blocks wide
level 2: 


adjacent walls
91C1D2AF
91C1D813
91C1DD77

1380 apart from walls

Bullet count limits:
Player: 5
Brown tank: 1
Ash Tank: 1
Marine: 1
Pink: 3
Yellow: 1
Violet: 5
Green: 2
White: 5
Black: 3


AI_PARAMETER_SHEET info: 
https://drive.google.com/file/d/1mSILvzJ-UFeAfQZyZZuL1_zOVu31JoPo/view
Word 1 — Invisibilty flag
Word 3 – Mine Count Limit
Word 38 - Bullet speed
Word 42 – Bullet Stun Timer

1 block is 35.0 units by 35.0 units
mine explosion is roughly 70.0 units
map is 770.0 x 595.0 units on 16:9
map is 560 x 595 units on 4:3