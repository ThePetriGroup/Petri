# *Petri* communication protocol (*draft*)

*– This document is not finished, and provided as a basis for early
discussion –*

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

The term *base-4096* shall refer to the encoding of *int*-s into
sequences of Unicode codepoints for the sake of efficient transport of
numbers in text messages. The encoding consists of two, three, or four
characters in sequence; the last character, with a value of `U+FFFF` acts
as a sentinel delimiting the number from further data, the other characters
represent the "digits" of the number when transformed to a numeral system
with the base of 4096, with the digits directly mapped to Unicode codepoints
with the corresponding values, transferred in big-endian order.

A `cell ID` shall be a unique integer in the range \[0;2^31-1\] (so that it
fits into an *int*), identifying a cell (client). ID's may be re-used after
a cell exits; the other clients should be notified of that.

## Message structure

Message boundaries are implicitly preserved by the underlying protocol,
so the Petri protocol need not take care of them.

Messages are discriminated by their first byte/character (for
binary/text messages, respectively). For binary messages, the first bytes
shall be interpreted as encoded using ASCII.

### Message contents

- `z` – *Zone* (binary; client → server): Transferred once during
  initialization, and later when the client's window or the zoom level
  change, this message tells the server how many grid units far the client
  can "see" other cells.

  The `z` is immediately followed by two ints, *x* encoding the maximum
  distance the user can see along the x axis, and similarly *y* for the
  y axis.
- `n` – *(Client-side) nick* (text; client → server): This informs the
  server about the nick-name the client has chosen. Nick-names can be changed
  at any time, and other clients should be promptly informed of these changes.

  The command letter is immediately followed by the nick-name to be used,
  the latter being terminated by the message's end.
- `N` – *Nick(s)* (text; server → client): Estabilishes a mapping between
  cell ID's and nick-names. Sent as soon as a cell comes into the client's
  field of vision (*or for every cell on the server (?)*).

  The command letter is followed by pairs of base-4096 encoded cell ID's and
  corresponding names, with each name terminated by the sentinel `U+FFFF`.
  Clients should be prevented from using that character, as well as any
  other Unicode non-character or surrogate codepoint.
- `E` – *Error* (text; server → client): Informs the client of an error, such
  as an invalid nick-name.

  The command letter is followed by a base-4096 encoded error code (concrete
  error codes are to be agreed on later), after which an error message
  terminated by the (protocol) message's end follows.

*– More to follow... –*
