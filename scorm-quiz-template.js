export const template = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{QUIZ_TITLE}}</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <script>
      tailwind.config = {
        theme: {
          extend: {
            colors: {
              brand: { blue: '#fa975e', green: '#7fc241' }
            }
          }
        }
      }
    </script>
    <style>
      body { font-family: sans-serif; }
      .hide { display: none; }
    </style>
</head>
<body class="bg-slate-50 text-slate-900 pb-20">

    <!-- Header -->
    <header class="bg-brand-blue text-white shadow-md sticky top-0 z-50">
      <div class="max-w-4xl mx-auto px-6 h-16 flex items-center justify-between">
        <span class="font-bold text-xl tracking-tight">H5P Creator</span>
        <span id="score-display" class="font-mono bg-white/20 px-3 py-1 rounded hidden">Score: 0%</span>
      </div>
    </header>

    <main class="max-w-4xl mx-auto p-6 space-y-8 mt-6" id="quiz-container">
        <!-- Questions will be injected here -->
    </main>

    <div class="fixed bottom-0 left-0 w-full bg-white border-t border-slate-200 p-4 flex justify-center z-40">
        <button id="submit-btn" class="bg-brand-blue hover:bg-orange-500 text-white px-8 py-3 rounded-xl font-bold shadow-lg transition-transform active:scale-95">
            Submit Answers
        </button>
        <div id="result-message" class="hidden text-xl font-bold text-slate-800"></div>
    </div>

    <script>
        // --- 1. SCORM API WRAPPER (Simplified) ---
        var scorm = {
            active: false,
            init: function() {
                var api = window.API || (window.parent && window.parent.API);
                if (api) {
                    api.LMSInitialize("");
                    this.active = true;
                    api.LMSSetValue("cmi.core.lesson_status", "incomplete");
                    api.LMSCommit("");
                }
            },
            setScore: function(score, status) {
                if (!this.active) return;
                var api = window.API || (window.parent && window.parent.API);
                if (api) {
                    api.LMSSetValue("cmi.core.score.raw", score);
                    api.LMSSetValue("cmi.core.lesson_status", status);
                    api.LMSCommit("");
                    api.LMSFinish("");
                }
            }
        };

        // --- 2. QUIZ DATA & STATE ---
        const data = {{QUIZ_DATA}};
        const userAnswers = {};
        let isSubmitted = false;

        const WORD_NORMALIZE_REGEX = /[^\\p{L}\\p{N}]+/gu;
        const normalizeWord = (word = "") => word.replace(WORD_NORMALIZE_REGEX, "").toLowerCase();
        const extractNormalizedFromToken = (tokenId = "") => {
            const parts = tokenId.split(":");
            return parts[1] ? parts[1] : normalizeWord(parts[0]);
        };
        const isMarkWordsAnswerCorrect = (selection = [], targets = []) => {
            if (!targets.length) return false;
            const normalizedTargets = new Set((targets || []).map(normalizeWord));
            const normalizedSelections = new Set((selection || []).map(extractNormalizedFromToken).filter(Boolean));
            if (normalizedTargets.size !== normalizedSelections.size) return false;
            for (const target of normalizedTargets) {
                if (!normalizedSelections.has(target)) {
                    return false;
                }
            }
            return true;
        };
        const isTrueFalseAnswerCorrect = (answer, expected) => {
            if (typeof expected !== "boolean") return false;
            if (!answer) return false;
            return (answer === "true" && expected) || (answer === "false" && !expected);
        };

        // --- 3. RENDERERS ---
        const container = document.getElementById('quiz-container');

        function renderQuiz() {
            container.innerHTML = '';
            
            // Title
            const title = document.createElement('div');
            title.className = "mb-8 border-b border-slate-200 pb-6";
            title.innerHTML = \`<h1 class="text-3xl font-bold text-slate-900">\${data.title}</h1><p class="text-slate-500 mt-2">\${data.summary}</p>\`;
            container.appendChild(title);

            data.exercises.forEach((ex, index) => {
                const card = document.createElement('div');
                card.className = "bg-white rounded-xl p-8 shadow-sm border border-slate-200 relative overflow-hidden group mb-8";
                card.id = \`card-\${ex.id}\`;
                
                // Header
                const header = document.createElement('div');
                header.className = "flex items-center gap-3 mb-6";
                header.innerHTML = \`<span class="flex items-center justify-center w-8 h-8 rounded-full bg-brand-blue/10 text-brand-blue font-bold text-sm">\${index + 1}</span>
                                    <span class="text-xs font-bold tracking-wider text-slate-400 uppercase">\${ex.type.replace('_', ' ')}</span>\`;
                card.appendChild(header);

                // Content
                const contentDiv = document.createElement('div');
                contentDiv.className = "pl-2";

                if (ex.type === 'multiple_choice') {
                    renderMC(contentDiv, ex);
                } else if (ex.type === 'fill_blank') {
                    renderFillBlank(contentDiv, ex);
                } else if (ex.type === 'true_false') {
                    renderTrueFalse(contentDiv, ex);
                } else if (ex.type === 'mark_words') {
                    renderMarkWords(contentDiv, ex);
                }

                const explanation = document.createElement('div');
                explanation.id = \`exp-\${ex.id}\`;
                explanation.className = "hidden mt-6 p-4 bg-blue-50 border border-blue-100 rounded-xl";
                explanation.innerHTML = \`<p class="font-bold text-brand-blue text-sm mb-1">Explanation</p><p class="text-slate-700 text-sm">\${ex.explanation || 'No explanation provided.'}</p>\`;
                card.appendChild(contentDiv);
                card.appendChild(explanation);
                container.appendChild(card);
            });
        }

        function renderMC(el, ex) {
            el.innerHTML = \`<h3 class="font-semibold text-xl text-slate-800 mb-6">\${ex.question}</h3>\`;
            const optsDiv = document.createElement('div');
            optsDiv.className = "grid grid-cols-1 gap-3";
            
            (ex.options || []).forEach(opt => {
                const btn = document.createElement('button');
                btn.className = "text-left w-full p-4 border rounded-xl transition-all border-slate-200 hover:border-brand-blue/50 text-slate-700 font-medium option-btn";
                btn.textContent = opt;
                btn.onclick = () => {
                    if (isSubmitted) return;
                    userAnswers[ex.id] = opt;
                    Array.from(optsDiv.children).forEach(c => c.className = c.className.replace('border-brand-blue bg-orange-50 ring-1 ring-brand-blue', 'border-slate-200'));
                    btn.className = btn.className.replace('border-slate-200', 'border-brand-blue bg-orange-50 ring-1 ring-brand-blue');
                };
                optsDiv.appendChild(btn);
            });
            el.appendChild(optsDiv);
        }

        function renderTrueFalse(el, ex) {
            el.innerHTML = \`<h3 class="font-semibold text-xl text-slate-800 mb-6">\${ex.question}</h3>\`;
            const optsDiv = document.createElement('div');
            optsDiv.className = "flex gap-4";
            
            ['True', 'False'].forEach(opt => {
                const btn = document.createElement('button');
                btn.className = "flex-1 py-4 rounded-xl border-2 font-bold text-lg transition-all border-slate-200 text-slate-600 hover:border-brand-blue hover:text-brand-blue option-btn";
                btn.textContent = opt;
                btn.onclick = () => {
                    if (isSubmitted) return;
                    userAnswers[ex.id] = opt.toLowerCase();
                    Array.from(optsDiv.children).forEach(c => {
                        c.className = "flex-1 py-4 rounded-xl border-2 font-bold text-lg transition-all border-slate-200 text-slate-600 hover:border-brand-blue hover:text-brand-blue option-btn";
                    });
                    btn.className = "flex-1 py-4 rounded-xl border-2 font-bold text-lg transition-all bg-brand-blue text-white border-brand-blue ring-2 ring-offset-2 ring-brand-blue/30 option-btn";
                };
                optsDiv.appendChild(btn);
            });
            el.appendChild(optsDiv);
        }

        function renderMarkWords(el, ex) {
            const text = ex.markWordsText || "";
            el.innerHTML = \`<h3 class="font-semibold text-xl text-slate-800 mb-2">\${ex.question}</h3><p class="text-sm text-slate-500 mb-3">Tap every word that satisfies the instruction.</p>\`;

            const tokens = text.split(/(\\s+)/);
            const targets = new Set((ex.markWordsTargets || []).map(normalizeWord));
            const selected = new Set(Array.isArray(userAnswers[ex.id]) ? userAnswers[ex.id] : []);
            if (!userAnswers[ex.id]) {
                userAnswers[ex.id] = Array.from(selected);
            }

            const container = document.createElement('div');
            container.className = "p-5 bg-slate-50 rounded-xl border border-slate-200 leading-8 text-lg flex flex-wrap gap-2";

            tokens.forEach((token, idx) => {
                if (!token.trim()) {
                    const span = document.createElement('span');
                    span.textContent = token;
                    container.appendChild(span);
                    return;
                }

                const normalized = normalizeWord(token);
                if (!normalized) {
                    const plain = document.createElement('span');
                    plain.textContent = token;
                    container.appendChild(plain);
                    return;
                }

                const tokenId = \`\${idx}:\${normalized}\`;
                const btn = document.createElement('button');
                btn.type = "button";
                btn.dataset.tokenId = tokenId;
                const baseClass = "px-1 py-0.5 rounded transition-colors cursor-pointer";
                const activeClass = " bg-brand-blue/10 text-brand-blue border-b border-brand-blue";
                btn.className = baseClass + (selected.has(tokenId) ? activeClass : " hover:bg-slate-100 text-slate-700");
                btn.textContent = token;
                btn.onclick = () => {
                    if (isSubmitted) return;
                    if (selected.has(tokenId)) {
                        selected.delete(tokenId);
                        btn.className = baseClass + " hover:bg-slate-100 text-slate-700";
                    } else {
                        selected.add(tokenId);
                        btn.className = baseClass + activeClass;
                    }
                    userAnswers[ex.id] = Array.from(selected);
                };
                container.appendChild(btn);
            });

            el.appendChild(container);
        }

        function renderFillBlank(el, ex) {
            const prompt = ex.taskDescription || ex.question;
            el.innerHTML = \`<h3 class="font-semibold text-xl text-slate-800 mb-4">\${prompt}</h3>\`;
            
            const box = document.createElement('div');
            box.className = "p-8 bg-slate-50 rounded-xl border border-slate-200 text-xl leading-loose font-serif text-slate-700";
            
            const match = (ex.sentence || "").match(/\\*(.*?)\\*/);
            const parts = match ? (ex.sentence || "").split(match[0]) : [ex.sentence || ""];
            const input = document.createElement('input');
            input.type = "text";
            input.id = \`input-\${ex.id}\`;
            input.value = userAnswers[ex.id] || "";
            input.placeholder = "Type your answer";
            input.className = "min-w-[160px] px-3 py-2 border-b-2 bg-white rounded-md text-lg focus:outline-none border-brand-blue text-brand-blue";
            input.oninput = (e) => {
                userAnswers[ex.id] = e.target.value;
            };

            box.appendChild(document.createTextNode(parts[0] || ""));
            box.appendChild(input);
            if (parts[1]) {
                box.appendChild(document.createTextNode(parts[1]));
            }
            
            el.appendChild(box);
        }

        // --- 4. SUBMIT LOGIC ---
        document.getElementById('submit-btn').onclick = function() {
            if (isSubmitted) return;
            isSubmitted = true;
            let correct = 0;
            let total = 0;

            data.exercises.forEach(ex => {
                total++;
                const ans = userAnswers[ex.id];
                let isRight = false;

                const card = document.getElementById(\`card-\${ex.id}\`);
                const exp = document.getElementById(\`exp-\${ex.id}\`);
                if (exp) exp.classList.remove('hidden');

                if (ex.type === 'multiple_choice') {
                    if (ans && ans === ex.correctAnswer) isRight = true;
                } 
                else if (ex.type === 'true_false') {
                    if (isTrueFalseAnswerCorrect(ans, ex.trueFalseAnswer)) isRight = true;
                }
                else if (ex.type === 'fill_blank') {
                    const match = (ex.sentence || "").match(/\\*(.*?)\\*/);
                    const correctWord = match ? match[1] : '';
                    const response = (ans || "").toString().trim().toLowerCase();
                    if (correctWord && response && response === correctWord.toLowerCase().trim()) isRight = true;
                    
                    const inputEl = document.getElementById(\`input-\${ex.id}\`);
                    if (inputEl) {
                        inputEl.setAttribute('disabled', 'true');
                        inputEl.classList.remove('border-brand-blue', 'text-brand-blue');
                        if(isRight) inputEl.classList.add('border-brand-green', 'bg-green-50', 'text-brand-green');
                        else inputEl.classList.add('border-red-500', 'bg-red-50', 'text-red-600');
                    }
                }
                else if (ex.type === 'mark_words') {
                    const selections = Array.isArray(ans) ? ans : [];
                    if (isMarkWordsAnswerCorrect(selections, ex.markWordsTargets || [])) {
                        isRight = true;
                    }
                    if (card) {
                        card.querySelectorAll('[data-token-id]').forEach(btn => btn.setAttribute('disabled', 'true'));
                    }
                }

                if (isRight) {
                    correct++;
                    if (card) {
                        card.classList.add('ring-2', 'ring-brand-green', 'bg-green-50/20');
                    }
                } else {
                    if (card) {
                        card.classList.add('ring-2', 'ring-red-200', 'bg-red-50/20');
                    }
                }
            });

            const percentage = Math.round((correct / total) * 100);
            
            const btn = document.getElementById('submit-btn');
            btn.classList.add('hidden');
            
            const msg = document.getElementById('result-message');
            msg.textContent = \`You scored \${correct} / \${total} (\${percentage}%)\`;
            msg.className = percentage >= 50 ? "text-xl font-bold text-brand-green block" : "text-xl font-bold text-red-600 block";

            const scoreDisplay = document.getElementById('score-display');
            scoreDisplay.textContent = \`Score: \${percentage}%\`;
            scoreDisplay.classList.remove('hidden');

            const status = percentage >= 50 ? "passed" : "failed";
            scorm.setScore(percentage, status);
        };

        window.onload = function() {
            scorm.init();
            renderQuiz();
        };
    </script>
</body>
</html>`;

