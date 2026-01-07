import requests

HEADERS = {
    "User-Agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 "
                  "(KHTML, like Gecko) Chrome/120.0 Safari/537.36"
}

# Disease → Drug Map
disease_drug_map = {
    "Pleural Effusion": "Furosemide",
    "Pneumonia": "Azithromycin",
    "Tuberculosis": "Isoniazid",
    "COPD": "Albuterol",
    "Pulmonary Edema": "Furosemide",
    "Cardiomegaly": "No specific drug",
    "Atelectasis": "No specific drug"
}

# ---------------- Wikipedia Fetch -----------------
def fetch_wikipedia(disease_name: str):
    try:
        search_url = (
            "https://en.wikipedia.org/w/api.php?"
            "action=query&list=search&srsearch={}&format=json"
        ).format(disease_name)

        search_resp = requests.get(search_url, headers=HEADERS, timeout=10)
        if search_resp.status_code != 200:
            return "Wikipedia fetch error.", ""

        results = search_resp.json().get("query", {}).get("search", [])
        if not results:
            return "No reliable summary found for this condition.", ""

        best_title = results[0]["title"]
        title_api = best_title.replace(" ", "_")

        summary_url = f"https://en.wikipedia.org/api/rest_v1/page/summary/{title_api}"
        summary_resp = requests.get(summary_url, headers=HEADERS, timeout=10)
        if summary_resp.status_code != 200:
            return "No summary available for this condition.", ""

        data = summary_resp.json()
        extract = data.get("extract", "")
        if not extract:
            return "No summary available.", ""

        url = data.get("content_urls", {}).get("desktop", {}).get("page", "")
        return extract, url

    except Exception:
        return "Wikipedia fetch error.", ""

# ---------------- FDA Drug Info -----------------
def fetch_openfda_drug(disease_name: str):
    try:
        drug = disease_drug_map.get(disease_name, None)
        if drug is None or "No specific drug" in drug:
            return "No FDA-approved drug specifically recommended for this condition.", \
                   "https://open.fda.gov/"

        url = f"https://api.fda.gov/drug/label.json?search=openfda.generic_name:{drug}&limit=1"
        resp = requests.get(url, headers=HEADERS, timeout=10)
        if resp.status_code == 200:
            results = resp.json().get("results", [])
            if results:
                purpose_list = results[0].get("purpose") or results[0].get("indications_and_usage") or ["No purpose information found."]
                return purpose_list[0], "https://open.fda.gov/"

        return "No FDA information available for this drug.", "https://open.fda.gov/"

    except Exception:
        return "FDA fetch error.", "https://open.fda.gov/"