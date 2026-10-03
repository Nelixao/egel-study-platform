export default function BibliotecaPage() {
  return (
    <main className="min-h-screen bg-slate-50">
      <div className="max-w-4xl mx-auto px-6 py-20 text-center">
        <div className="inline-flex w-16 h-16 rounded-2xl bg-amber-100 items-center justify-center mb-6">
          <span className="text-3xl">📖</span>
        </div>
        <h1 className="text-3xl font-bold text-slate-900 mb-3">
          Biblioteca
        </h1>
        <p className="text-slate-600 max-w-lg mx-auto mb-8">
          Esta sección te permitirá subir PDFs de libros, videos y otros
          recursos. También podrás generar preguntas automáticamente a partir
          del contenido.
        </p>
        <span className="inline-block text-sm font-medium bg-amber-100 text-amber-700 px-4 py-2 rounded-full">
          En construcción
        </span>
      </div>
    </main>
  );
}
