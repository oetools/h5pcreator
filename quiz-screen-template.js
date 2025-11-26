export const template = `
                    <div class="max-w-[1400px] mx-auto pb-32 py-10">
                        <div class="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-200 pb-6">
                            <div class="flex-1">
                                <h2 class="text-3xl font-bold text-slate-900 leading-tight">{{QUIZ_TITLE}}</h2>
                                <p class="text-slate-500 mt-2 text-lg">{{QUIZ_SUMMARY}}</p>
                            </div>
                            <div class="flex flex-col items-stretch gap-3 shrink-0 sm:flex-row sm:items-center sm:justify-end">
                                <span class="bg-slate-100 text-slate-600 px-4 py-2 rounded-full text-sm font-semibold border border-slate-200 text-center">
                                    {{EXERCISES_COUNT}} Exercises
                                </span>
                                <div class="flex flex-wrap gap-3">
                                    <button id="export-h5p" class="flex items-center gap-2 px-6 py-2.5 rounded-lg text-lg font-semibold text-white bg-[#7AC143] shadow-[0_4px_8px_rgba(250,151,94,0.3)] transition-all hover:bg-[#5a8f32] hover:-translate-y-0.5 {{EXPORT_H5P_CLASSES}}" {{EXPORT_DISABLED}}>
                                        {{EXPORT_H5P_ICON}}
                                        Export H5P
                                    </button>
                                    <button id="export-scorm" class="flex items-center gap-2 px-6 py-2.5 rounded-lg text-lg font-semibold text-white bg-[#7AC143] shadow-[0_4px_8px_rgba(250,151,94,0.3)] transition-all hover:bg-[#5a8f32] hover:-translate-y-0.5 {{EXPORT_SCORM_CLASSES}}" {{EXPORT_DISABLED}}>
                                        {{EXPORT_SCORM_ICON}}
                                        Export SCORM
                                    </button>
                                    <button id="export-html" class="flex items-center gap-2 px-6 py-2.5 rounded-lg text-lg font-semibold text-white bg-[#7AC143] shadow-[0_4px_8px_rgba(250,151,94,0.3)] transition-all hover:bg-[#5a8f32] hover:-translate-y-0.5 {{EXPORT_HTML_CLASSES}}" {{EXPORT_DISABLED}}>
                                        {{EXPORT_HTML_ICON}}
                                        Export HTML
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div id="exercises-container" class="space-y-12"></div>
                        <div class="mt-12 border-t border-slate-200 pt-6 space-y-4">
                            <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                                <button id="start-over-btn" class="text-slate-500 hover:text-slate-800 font-medium px-4 py-2 transition-colors hover:bg-slate-100 rounded-lg">
                                    Start Over
                                </button>
                                {{ACTION_BUTTON_HTML}}
                            </div>
                        </div>
                    </div>
                `;

