export const template = `
                    <div class="max-w-[1400px] mx-auto space-y-8 py-10">
                        <div class="bg-white/95 rounded-3xl shadow-lg border border-slate-100 overflow-hidden">
                            <div class="bg-slate-50 border-b border-slate-100 p-6 space-y-6">
                                <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                    <div class="flex items-center gap-2">
                                        {{ICON:FileText:w-5 h-5 text-brand-blue}}
                                        <span class="font-bold text-slate-700">Lesson Content</span>
                                    </div>
                                    <div class="flex flex-wrap items-center gap-x-6 gap-y-3">
                                        <div class="flex items-center gap-2 bg-white px-3 py-1.5 rounded-lg border border-slate-200 shadow-sm">
                                            {{ICON:Languages:w-4 h-4 text-slate-400}}
                                            <select id="language-select" class="bg-transparent text-sm font-medium text-slate-600 focus:outline-none cursor-pointer">
                                                <option value="English" {{LANGUAGE_SELECTED_ENGLISH}}>English</option>
                                                <option value="Chinese (Hong Kong)" {{LANGUAGE_SELECTED_CHINESE}}>Traditional Chinese (HK)</option>
                                            </select>
                                        </div>
                                        <div class="flex items-center gap-2 bg-white px-3 py-1.5 rounded-lg border border-slate-200 shadow-sm">
                                            <span class="text-sm font-medium text-slate-500">Count:</span>
                                            <input id="question-count" type="number" min="1" max="20" value="{{QUESTION_COUNT}}" class="w-12 text-sm font-bold text-slate-700 focus:outline-none text-center bg-transparent">
                                        </div>
                                    </div>
                                </div>
                                <div class="flex flex-wrap items-center gap-4 pt-4 border-t border-slate-200">
                                    <div class="flex items-center gap-2 text-sm font-medium text-slate-500 mr-2">
                                        {{ICON:Settings:w-4 h-4}}
                                        <span>Include:</span>
                                    </div>
                                    {{FILL_BLANK_BUTTON}}
                                    {{MULTIPLE_CHOICE_BUTTON}}
                                    {{MARK_WORDS_BUTTON}}
                                    {{TRUE_FALSE_BUTTON}}
                                </div>
                            </div>
                            <div class="p-6 space-y-6 bg-white">
                                <section id="drop-zone" class="rounded-2xl border-2 border-dashed transition-all duration-200 cursor-pointer px-6 py-8 text-center {{DRAG_ACTIVE_CLASSES}}">
                                    {{ICON:UploadCloud:w-12 h-12 mx-auto text-brand-blue}}
                                    <p class="text-lg font-semibold text-slate-700 mt-4">
                                        Drag & drop a document here or click to select
                                    </p>
                                    <p class="text-sm text-slate-500 mt-2">
                                        Supported formats: TXT, SRT, JSON, XML, HTML, MD, CSV, ASS, SSA, DOCX, PPTX, PDF
                                    </p>
                                    <input id="file-input" type="file" class="hidden" accept=".txt,.srt,.json,.xml,.html,.md,.csv,.ass,.ssa,.docx,.pptx,.pdf">
                                </section>
                                <div class="relative">
                                    <textarea id="lesson-text" class="w-full h-80 p-6 text-slate-700 placeholder:text-slate-300 focus:outline-none resize-none text-lg leading-relaxed bg-white border border-slate-200 rounded-2xl focus:bg-white focus:border-brand-blue focus:ring-4 focus:ring-brand-blue/20 transition-all" placeholder="Paste your lesson plan, article, or lecture notes here...">{{LESSON_TEXT}}</textarea>
                                    <div class="absolute bottom-4 right-6 text-xs text-slate-400 pointer-events-none">
                                        {{LESSON_TEXT_LENGTH}} chars
                                    </div>
                                </div>
                                <div class="flex flex-col lg:flex-row items-center justify-between gap-4 border-t border-slate-100 pt-6">
                                    <div class="flex items-center gap-2 text-sm text-slate-500 px-4 py-2 rounded-lg border border-slate-200 bg-slate-50 w-full lg:w-auto">
                                        <span>Deepseek API Key:</span>
                                        <input id="api-key-input" type="password" value="{{API_KEY}}" placeholder="paste here" class="ml-2 w-64 bg-transparent focus:outline-none text-slate-700">
                                        <button id="clear-api-key" class="ml-2 px-2 py-1 rounded-md border border-slate-300 hover:bg-slate-50">Clear</button>
                                    </div>
                                    <button id="generate-btn" class="flex items-center gap-2 px-8 py-3 rounded-full font-bold text-white shadow-lg transition-all {{GENERATE_BUTTON_CLASSES}}" {{GENERATE_BUTTON_DISABLED}}>
                                        {{ICON:Sparkles:w-5 h-5}}
                                        Generate Quiz
                                    </button>
                                </div>
                            </div>
                        </div>
                        {{ERROR_MESSAGE}}
                    </div>
                `;

