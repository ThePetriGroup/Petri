## Contributing

Everyone can help out with this probject. Any skill can be applied.

But. There are a few guidelines to help you to help so that everything
doesn't become an enormous mess.

- Small changes can be pushed directly to this repo, while larger ones should
  be included in a pull request.
- When you put in a pull request, first rebase it. This makes the merge much
  simpler and easier to do.
- All server related stuff should go in the "server" branch, all client
  related stuff should go in the "client" branch. Dev work that does not go
  into either should go into the "dev" branch which over time will be merged
  into "master". 
- Make use of issues. If there's a bug you can't fix, then put it there. Don't
  use a !notify.

## Style

Using a consistent style across code helps it to look nice and makes it
easier to edit.

- Use `CamelCase` for classes and `under_score` for variables and functions.
- Use [1TBS](https://en.wikipedia.org/wiki/Indent_style#Variant:_1TBS) style
  for all code.
- Indentation should be 4 spaces. No more and no less.
- No lines should go over 80 chars unless you have a **very** good reason.
- All markup languages should use lower case tags and should be indented for
  easier reading.
- Comments are very important. However, they should never say what the code
  does, they should explain what it is for.

## General Rules

Pretty much everything in the Zen of Python is good style. So go with that.

```python3
>>> import this
The Zen of Python, by Tim Peters

Beautiful is better than ugly.
Explicit is better than implicit.
Simple is better than complex.
Complex is better than complicated.
Flat is better than nested.
Sparse is better than dense.
Readability counts.
Special cases aren't special enough to break the rules.
Although practicality beats purity.
Errors should never pass silently.
Unless explicitly silenced.
In the face of ambiguity, refuse the temptation to guess.
There should be one-- and preferably only one --obvious way to do it.
Although that way may not be obvious at first unless you're Dutch.
Now is better than never.
Although never is often better than *right* now.
If the implementation is hard to explain, it's a bad idea.
If the implementation is easy to explain, it may be a good idea.
Namespaces are one honking great idea -- let's do more of those!
```
