#!/bin/bash
# notify.sh - Desktop notification when Claude needs attention

# Detect OS and show native notification
if [[ "$OSTYPE" == "darwin"* ]]; then
  # macOS
  osascript -e 'display notification "The Agent CLI needs your attention" with title "Agent CLI"'
elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
  # Linux
  notify-send 'Agent CLI' 'Agent CLI needs your attention'
elif [[ "$OSTYPE" == "msys" || "$OSTYPE" == "cygwin" ]]; then
  # Windows
  powershell.exe -Command "[System.Reflection.Assembly]::LoadWithPartialName('System.Windows.Forms'); [System.Windows.Forms.MessageBox]::Show('Agent CLI needs your attention', 'Agent CLI')"
fi

exit 0
