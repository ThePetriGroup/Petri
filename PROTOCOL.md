# Petri communication protocol

*This protocol is not final. Changes may happen at any time.*

## Abstract

This document describes the communication protocol to be used by Petri.

## Introduction

Because of client-side constraints (browser-run sandboxed JavaScript),
*WebSockets* are the only sane choice for the communication medium
(individual HTTP requests would add too much overhead for a real-time
application).

Further, because of real-time requirements, *JSON* does not – alas –
qualify as a good data format, because it would add too much unnecessary
redundancy.

Therefore, this proposal votes for a *custom binary/text-based protocol
on top of WebSockets*.

## Definitions

In the further discussion, *int*-s shall be signed two's-complement
32-bit integers, transferred as four octets, with the highest-order bits
first ("big-endian byte order").

*float*-s shall be [IEEE 754](https://en.wikipedia.org/wiki/IEE_754) 32-bit
floating-point numbers, transferred as defined in the standard.

The term *base-4096* shall refer to the encoding of *int*-s into
sequences of Unicode codepoints for the sake of efficient transport of
numbers in text messages. The encoding consists of two, three, or four
characters in sequence; the last character, with a value of `U+FFFF`, acts
as a sentinel delimiting the number from further data, the other characters
represent the "digits" of the number when transformed to a numeral system
with the base of 4096, with the digits directly mapped to Unicode codepoints
with the corresponding values. The digits are transferred in big-endian
order.

A *cell ID* shall be a unique integer in the range \[0;2³¹-1\] (so that it
fits into an *int*), identifying a cell (client). ID's may be re-used after
a cell exits; the other clients should be notified of that. A *player ID* is
an integer in the same range as a cell ID. The namespaces are separate.

## Message structure

Message boundaries are implicitly preserved by the underlying protocol, so
the Petri protocol need not take care of them.

Messages are discriminated by their first byte/character (for
binary/text messages, respectively). For binary messages, the first bytes
shall be interpreted as encoded using ASCII.

### Message contents

**Client-side messages**

- `z` – *Zone* (binary): Transferred once during initialization, and later
  when the client's window or the zoom level change, this message tells the
  server how many grid units far the client can "see" other cells.

  The `z` is immediately followed by two floats, `x` encoding the maximum
  distance the user can see along the x axis, and similarly `y` for the y
  axis.
- `n` – *(Client-side) nick* (text): This informs the server about the
  nick-name the client has chosen. Nick-names can be changed at any time, and
  other clients should be promptly informed of these changes.

  The command letter is immediately followed by the nick-name to be used,
  the latter being terminated by the message's end.
- `p` – *Participation status* (text): Transferred when the client changes
  its "participation status" (and during initialization); the message
  contents encode the actual status.

  **Participation statuses**

  - `i` – *Idle*: Not doing anything (like, before the game has been
    entered). Is set to indicate a leave. Assumed initially.
  - `p` – *Playing*: Actively taking part in the game.
  - *Spectating might be added in a later revision.*
- `d` – *Direction* (binary): This message informs the server about the
  direction the client is heading to now.

  The message contents are two coordinates `x` and `y` encoded as floats;
  they represent the point all of the player's cells are moving to.

**Server-side messages**

- `I` – *Identity* (binary): This message tells the client about its own
  player ID.

  The message contents are a single int encoding the ID.
- `M` – *Mapping* (binary): This transports the mapping between user ID's and
  cell ID's.

  The contents of the messages are a sequence of records of ints, each first
  int of a record is the player ID, the second one is either a
  (corresponding) cell ID, or a negative number that, if negated "back",
  gives the amount of cell ID's corresponding to the player ID that follow.
- `N` – *Nick(s)* (text): Estabilishes a mapping between player ID's and
  nick-names. Sent as soon as a cell comes into the client's field of vision,
  or on other occasions (like for cells which are part of the leaderboard, or
  for cells that change their nicks, or even just for all cells).

  The command letter is followed by pairs of base-4096 encoded cell ID's and
  corresponding names, with each name terminated by the sentinel `U+FFFF`.
  Clients should be prevented from using that character, as well as any
  other Unicode non-character or surrogate codepoint.
- `C` – *Color(s)* (binary): Tells the client about players' colors.

  The `C` is followed by records of two ints, where the first int is a
  player ID, and the second one is the color (packed as a `0x00RRGGBB` int).
- `W` – *Weight(s)* (binary): Informs the client about the masses of cells (in
  particular, their changes). If a cell's mass is told to become negative, it
  has been eaten, and should be deallocated. If a client has no cells left,
  it implicitly becomes *idle*, and has to actively join the game again to
  get a new cell.

  The data part of the message is a sequence of cell-ID-mass pairs, where the
  ID is an int and the mass a float.
- `F` – *Food* (binary): This message contains data about the locations of
  "food" (little edible passive pieces) to be added or deleted. Because of
  bandwidth restrictions, only data for

  The data part consists of a sequence of records, where each record starts
  with an ID encoded as an int (similar to a player of cell ID) first,
  followed by (optional) additional data. There are three "groups" of records
  (separated by records with an ID of `-1` and stripped data; in the
  following order):
  - *gone*: Food that has been eaten (or gone for other reasons). No
    additional data.
  - *new*: Food that just appears (either in the game in general, or in the
    player's FOV). Each ID is followed by a two-floats pair of x and y
    coordinates storing the position of the food.
  - *moving*: Food that appears moving. Each ID is followed by a coordinate
    pair as above, and a velocity duplet (in units per second), followed by
    a one-float deceleration factor containing which fraction of the velocity
    should have stayed after one second; the speed decays exponentially.

  Not all groups need be present.
- `L` – *Line(s)* (binary): Transfers motion information about cells on the
  server, including the client receiving the packet itself. Not all cells
  need to be covered in the packet, in particular, those ones who did turn
  should be prioritized over those ones who did not (if the need appears). To
  prevent innecessary data flow, data should be transmitted only for cells
  within the FOV of the player.

  The data part of the message consists of a sequence of records, where each
  record consists of an int and four floats. The int contains the cell ID the
  information is about, the floats are the position `x`, `y`, and the
  movement deltas `dx`, `dy` (in units per second); they are included in the
  order they are told about here.
- `P` – *Part(s)* (binary): Tells the client about deallocation of player
  ID's. All corresponding cell ID's are implicitly freed, too.

  The command letter is followed by a contiguous sequence of ints containing
  player ID's to deallocate.
- `E` – *Error* (text): Informs the client of an error, such as an invalid
  nick-name.

  The command letter is followed by a base-4096 encoded error code (concrete
  error codes are to be agreed on later), after which an error message
  terminated by the (protocol) message's end follows.
