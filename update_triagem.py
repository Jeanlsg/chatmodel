import re

# Read the original file
with open('src/TriagemAI.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Step 1: Add imports after the supabase import
import_addition = """import { supabase } from "@/integrations/supabase/client";
import SelectionView from './components/SelectionView';
import N8nChat from './components/N8nChat';"""

content = content.replace(
    'import { supabase } from "@/integrations/supabase/client";',
    import_addition
)

# Step 2: Update the currentView state comment
content = content.replace(
    "// States: 'landing', 'patient', 'chat', 'professional'",
    "// States: 'landing', 'patient', 'selection', 'chat', 'natural_chat', 'professional'"
)

# Step 3: Update handleStartTriage to go to 'selection' instead of 'chat'
content = content.replace(
    "setCurrentView('chat');",
    "setCurrentView('selection');"
)

# Step 4: Add the new view renderings
# Find the pattern for view rendering
old_pattern = r"(\{currentView === 'patient' \? \(\s+<PatientView[\s\S]*?\/>[\s\S]*?\) : currentView === 'chat' \?)"

new_pattern = r"""{currentView === 'patient' ? (
      <PatientView
        setCurrentView={setCurrentView}
        patientName={patientName}
        setPatientName={setPatientName}
        patientCpf={patientCpf}
        setPatientCpf={setPatientCpf}
        patientPhone={patientPhone}
        setPatientPhone={setPatientPhone}
        handleStartTriage={handleStartTriage}
      />
    ) : currentView === 'selection' ? (
      <SelectionView setCurrentView={setCurrentView} />
    ) : currentView === 'chat' ?"""

content = re.sub(old_pattern, new_pattern, content, flags=re.MULTILINE)

# Add natural_chat view before professional view
old_prof_pattern = r"(\) : currentView === 'professional' \?)"
new_prof_pattern = r""") : currentView === 'natural_chat' ? (
      <N8nChat 
        setCurrentView={setCurrentView}
        patientName={patientName}
      />
    ) : currentView === 'professional' ?"""

content = re.sub(old_prof_pattern, new_prof_pattern, content, flags=re.MULTILINE)

# Write the modified content
with open('src/TriagemAI.jsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("✅ TriagemAI.jsx updated successfully!")
