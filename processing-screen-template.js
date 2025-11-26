export const template = `
                    <div class="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-8">
                        <div class="relative">
                            <div class="w-24 h-24 rounded-full border-4 border-slate-100"></div>
                            <div class="absolute top-0 left-0 w-24 h-24 rounded-full border-4 border-brand-blue border-t-transparent animate-spin"></div>
                            <div class="absolute top-0 left-0 w-24 h-24 flex items-center justify-center">
                                {{ICON:BrainCircuit:w-8 h-8 text-brand-blue}}
                            </div>
                        </div>
                        <div>
                            <h2 class="text-2xl font-bold text-slate-800 mb-2">Analyzing Lesson Plan...</h2>
                            <p class="text-slate-500">Generating interactive exercises in {{SELECTED_LANGUAGE}}.</p>
                        </div>
                    </div>
                `;

