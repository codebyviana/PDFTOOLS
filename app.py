
from flask import Flask, render_template, request, send_file, jsonify
from PyPDF2 import PdfMerger
from io import BytesIO

app = Flask(__name__)

app.config["MAX_CONTENT_LENGTH"] = 50 * 1024 * 1024


@app.route("/")
def home():
    return render_template("index.html")


@app.route("/juntar", methods=["POST"])
def juntar_pdfs():

    arquivos = request.files.getlist("arquivos")

    if len(arquivos) < 2:
        return jsonify({"erro": "Selecione pelo menos dois PDFs."}), 400

    merger = PdfMerger()
    pdf_final = BytesIO()

    try:
        for arquivo in arquivos:

            if not arquivo.filename.lower().endswith(".pdf"):
                return jsonify({"erro": "Selecione apenas arquivos PDF."}), 400

            merger.append(arquivo.stream)

        merger.write(pdf_final)
        pdf_final.seek(0)

        return send_file(
            pdf_final,
            mimetype="application/pdf",
            as_attachment=True,
            download_name="PDF_Final.pdf"
        )

    except Exception:
        return jsonify({"erro": "Não foi possível juntar os arquivos."}), 400

    finally:
        merger.close()


@app.errorhandler(413)
def arquivo_grande(error):
    return jsonify({"erro": "O limite de 50 MB foi ultrapassado."}), 413


if __name__ == "__main__":
    app.run(debug=True)
