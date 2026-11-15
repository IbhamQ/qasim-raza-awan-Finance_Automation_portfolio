# Personal and company portfolio refresh

The personal homepage combines the Analyst Studio composition with editorial serif typography. Actual Power BI Desktop captures replace the conceptual dashboard imagery. The Finnovative page retains the Precision Studio / Stageshow implementation and receives the shared rail and theme controls.

`personal.css` styles the personal page. `shell.css` and `interactions.js` supply collapsible navigation, independently persisted brand themes, section search, keyboard controls, reading progress and back to top. Personal report tabs, screenshot enlargement and project filters are also handled here. The existing company bundle retains its walkthrough controls, mobile menu, copy-email control and Anime.js reveals. The existing portfolio assistant is retained on both pages.

`motion.js` is bundled from `motion.source.js` using Anime.js 4.5.0 and esbuild. Rebuild with these packages in a temporary build directory:

    esbuild motion.source.js --bundle --format=esm --minify --outfile=motion.js

Reduced-motion preferences skip personal Anime.js motion; shared CSS disables transitions. Case studies, employer achievements and client work retain their separate attributions. The two homepage report previews are synthetic portfolio demonstrations. Native project archives remain linked on the case pages.

Browser QA: desktop, expanded and collapsed rails, both themes, search, project filters, report tabs, enlarged screenshots, company menu on a 390px frame, Stageshow walkthrough and assistant dialog. The AI service was not sent a test message. Resume: three rendered pages, inspected and updated in PDF and DOCX form.
