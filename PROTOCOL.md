# *Petri* communication protocol (*draft*)

*– This document is not finished, and provided as a basis for early
discussion. –*

## Abstract

This document describes a possible communication protocol to be used
by Petri.

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
characters in sequence; the last character, with a value of `U+FFFF` acts
as a sentinel delimiting the number from further data, the other characters
represent the "digits" of the number when transformed to a numeral system
with the base of 4096, with the digits directly mapped to Unicode codepoints
with the corresponding values, transferred in big-endian order.

A *cell ID* shall be a unique integer in the range \[0;2^31-1\] (so that it
fits into an *int*), identifying a cell (client). ID's may be re-used after
a cell exits; the other clients should be notified of that.

## Message structure

Message boundaries are implicitly preserved by the underlying protocol,
so the Petri protocol need not take care of them.

Messages are discriminated by their first byte/character (for
binary/text messages, respectively). For binary messages, the first bytes
shall be interpreted as encoded using ASCII.

### Message contents

**Client-side messages**

- `z` – *Zone* (binary; client → server): Transferred once during
  initialization, and later when the client's window or the zoom level
  change, this message tells the server how many grid units far the client
  can "see" other cells.

  The `z` is immediately followed by two ints, `x` encoding the maximum
  distance the user can see along the x axis, and similarly `y` for the y
  axis.
- `n` – *(Client-side) nick* (text; client → server): This informs the
  server about the nick-name the client has chosen. Nick-names can be changed
  at any time, and other clients should be promptly informed of these changes.

  The command letter is immediately followed by the nick-name to be used,
  the latter being terminated by the message's end.
- `p` – *Participation status* (text; client → server): Transferred when the
  client changes its "participation status"; the message contents consist of
  that.

  **Participation statuses**

  - `i` – *Idle*: Not doing anything (like, before the game has been entered).
  - `p` – *Playing*: Actively taking part in the game.
  - *Spectating might be added.*
- `d` – *Direction* (binary; client → server): This message informs the server
  about the direction the client is heading to now, as well as about its
  speed.

  The message contents are two floats `dx` and `dy`, containing the velocity
  components of the client along the x and y axes in units per second. The
  overall speed of the client can be zero. It is the server's obligation to
  verify all direction data it receives.

**Server-side messages**

- `N` – *Nick(s)* (text; server → client): Estabilishes a mapping between
  cell ID's and nick-names. Sent as soon as a cell comes into the client's
  field of vision (*or for every cell on the server (?)*).

  The command letter is followed by pairs of base-4096 encoded cell ID's and
  corresponding names, with each name terminated by the sentinel `U+FFFF`.
  Clients should be prevented from using that character, as well as any
  other Unicode non-character or surrogate codepoint.
- `L` – *Line(s)* (binary; server → client): Transfers motion information
  about cells on the server, including the client receiving the packet
  itself. Not all cells need to be covered in the packet, in particular,
  those ones who did turn should be prioritized over those ones who did not,
  if the need appears (*???*). To prevent innecessary data flow, data should
  be transmitted only for cells within the FOV of the player.

  The "data part" of the message consists of a sequence of records, where each
  record consists of an int and four floats. The int contains the cell ID the
  information is about, the floats are the position `x`, `y`, and the movement
  deltas `dx`, `dy` (in units per second); they are included in the order they
  are told about here.
- `E` – *Error* (text; server → client): Informs the client of an error, such
  as an invalid nick-name.

  The command letter is followed by a base-4096 encoded error code (concrete
  error codes are to be agreed on later), after which an error message
  terminated by the (protocol) message's end follows.
- *Should colors be calculated server-side and transferred, or rather be
  calculated client-side?*

*– Feel free to comment! –*
