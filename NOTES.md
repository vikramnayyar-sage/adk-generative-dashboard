# Notes so far:

# Completed:
Charts create dynamically. ✅ 
Calling the same chart updates dynamically. ✅ 
Created MCP (Not yet integrated). ✅ 
Created concepts of cashflow, initial balance and customer (All visible to chat). ✅ 
Able to analyse existing records. ✅ 
Integrate MCP server and ensure recognised in Agent State. ✅

Next steps:

Selecting invoices to pay (Could be short ones). ✅* (Can be done implicitly).
Authorisation to make payments (AP2)??
Testing editing records (Payment Data) through chat (And seeing the graphs change). (MCP Tools*) - Works BUT need to ask for new graphs. ✅
Add contact functionality (Email ✅ /Phone through MCP tools)
Updates (E.g. update all debtors where payment is due within 3 days, email analysis if possible). ✅
Authorisation on low payment amounts?
Add way more charts. ✅
Multi agent possibilities & AP2*
Improve UX:
    Use React Grid for drag and drop charts.
    Fix Cashflow modal UI ✅
    Naming.
    Panels responsive (Quick CSS fix)

Actually use Sample data from Hackathon Repo.
Why are some charts 'coming soon'??



To run:
    npm run dev:ui
    scripts/run-agent.bat
        google env terminal

    Don't need to run MCP Server itself (Runs over STDIO).


LINKS:
    https://cloud.google.com/blog/topics/developers-practitioners/use-google-adk-and-mcp-with-an-external-server
    https://google.github.io/adk-docs/tools/mcp-tools/#step-1-define-your-agent-with-mcptoolset
    https://google.github.io/adk-docs/runtime/
    https://mailosaur.com/sms-testing?ppc_source=22040733043-175904385001-mailosaur&utm_term=mailosaur&utm_campaign=Search+%7C+Branded+Keywords&utm_source=adwords&utm_medium=ppc&hsa_acc=5285978464&hsa_cam=22040733043&hsa_grp=175904385001&hsa_ad=752024807496&hsa_src=g&hsa_tgt=kwd-883138294966&hsa_kw=mailosaur&hsa_mt=p&hsa_net=adwords&hsa_ver=3&gad_source=1&gad_campaignid=22040733043&gbraid=0AAAAADRaWdaHS9rYf4HoyPlXzsWbtzpY3&gclid=CjwKCAjwi4PHBhA-EiwAnjTHuWxPAfvCgikOSZ97NpvYawrIJSHVX337R-vBc4OknvRDtwPaW-n5WxoCLMQQAvD_BwE (For phone, use mailinator for emails)

    