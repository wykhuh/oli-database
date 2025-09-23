# https://stackoverflow.com/a/62699124
import hashlib

my_string = 'hello shake'
id = hashlib.shake_256(my_string.encode()).hexdigest(5)
print(id)
# '34177f6a0a'

# https://stackoverflow.com/questions/16780014/import-file-from-parent-directory
import sys
from pathlib import Path
sys.path.append(str(Path(__file__).parent.parent))

import envar as envar

print(envar.API_KEY)
