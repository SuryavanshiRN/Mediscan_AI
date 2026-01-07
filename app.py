import streamlit as st
import random
import pandas as pd
import io
from datetime import datetime
import matplotlib.pyplot as plt
import plotly.express as px
from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.lib.units import inch
from reportlab.pdfgen import canvas
from datetime import datetime

# -------------------- Page Config --------------------
st.set_page_config(
    page_title="AI Chest Disease Detection & Diagnosis System",
    layout="wide"
)

# -------------------- Hospital Background & CSS --------------------
def set_background(image_url=None):
    if image_url:
        st.markdown(f"""
        <style>
        .stApp {{
            background-image: url("{image_url}");
            background-size: cover;
            background-position: center;
            background-attachment: fixed;
        }}
        .report-box {{
            background-color: rgba(255, 255, 255, 0.85);
            padding: 15px;
            border-radius: 10px;
            margin-bottom: 15px;
        }}
        .critical {{
            background-color: rgba(255,0,0,0.3);
            padding: 10px;
            border-radius: 8px;
        }}
        </style>
        """, unsafe_allow_html=True)

# -------------------- Disease Info --------------------
diseases = {
    "Normal": "No abnormalities detected. Maintain a healthy lifestyle and routine check-ups.",
    "Pneumonia": "Signs suggest pneumonia. Consult a physician for possible antibiotics/antivirals.",
    "Tuberculosis": "Indicators of tuberculosis detected. Seek urgent medical evaluation and treatment.",
    "COVID-19": "Findings consistent with COVID-19. Isolate and consult a specialist immediately.",
    "Lung Cancer": "Possible signs of lung cancer. Urgent oncological consultation recommended.",
    "Bronchitis": "Consult a doctor for respiratory care and medication if necessary.",
    "Asthma": "Follow asthma treatment plan. Seek immediate help if severe symptoms occur.",
    "Emphysema": "Pulmonary specialist consultation recommended for further evaluation.",
    "Pulmonary Edema": "Immediate medical attention required. Hospitalize if necessary.",
    "Other Findings": "Consult medical expert for detailed examination."
}
critical_diseases = ["Lung Cancer", "Pulmonary Edema"]

# -------------------- Session State --------------------
if "patients" not in st.session_state:
    st.session_state["patients"] = []

# -------------------- Fake AI Prediction --------------------
def predict_disease(image, disease_name=None):
    if disease_name:
        return disease_name, round(random.uniform(0.6, 1.0), 2)
    disease = random.choice(list(diseases.keys()))
    confidence = round(random.uniform(0.5, 1.0), 2)
    return disease, confidence

def predict_multiple(image):
    return {d: round(random.uniform(0.5, 1.0), 2) for d in diseases}

# -------------------- Utility: Save Patient --------------------
def save_patient_info(name, age, gender, patient_id, disease, confidence):
    st.session_state.patients.append({
        "Name": name,
        "Age": age,
        "Gender": gender,
        "Patient ID": patient_id,
        "Disease": disease,
        "Confidence": confidence,
        "Date": datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    })

# -------------------- PDF Export --------------------
def generate_pdf(patient_info):
    buffer = io.BytesIO()
    c = canvas.Canvas(buffer, pagesize=letter)
    width, height = letter

    # === Header Section ===
    c.setFillColor(colors.HexColor("#004c97"))  # Dark blue bar
    c.rect(0, height - 80, width, 80, stroke=0, fill=1)
    c.setFillColor(colors.white)
    c.setFont("Helvetica-Bold", 20)
    c.drawString(50, height - 50, "AI Chest Disease Detection Report")

    # === Sub-header line ===
    c.setStrokeColor(colors.HexColor("#004c97"))
    c.setLineWidth(2)
    c.line(50, height - 90, width - 50, height - 90)

    # === Report Metadata ===
    c.setFillColor(colors.black)
    c.setFont("Helvetica", 10)
    generated_date = datetime.now().strftime("%B %d, %Y %I:%M %p")
    c.drawRightString(width - 50, height - 70, f"Generated on: {generated_date}")

    # === Patient Information Section ===
    y = height - 130
    c.setFont("Helvetica-Bold", 14)
    c.setFillColor(colors.HexColor("#004c97"))
    c.drawString(50, y, "Patient Information")
    y -= 10

    c.setStrokeColor(colors.HexColor("#004c97"))
    c.setLineWidth(1)
    c.line(50, y, width - 50, y)
    y -= 25

    c.setFont("Helvetica", 12)
    c.setFillColor(colors.black)

    for key, value in patient_info.items():
        c.drawString(60, y, f"{key}:")
        c.setFont("Helvetica-Bold", 12)
        c.drawString(180, y, str(value))
        c.setFont("Helvetica", 12)
        y -= 20
        if y < 100:  # Prevent overflow
            c.showPage()
            y = height - 100

    # === Footer Section ===
    c.setStrokeColor(colors.HexColor("#dddddd"))
    c.setLineWidth(0.5)
    c.line(50, 60, width - 50, 60)
    c.setFont("Helvetica-Oblique", 9)
    c.setFillColor(colors.gray)
    c.drawCentredString(width / 2, 45, "Confidential – For authorized medical use only")

    c.save()
    buffer.seek(0)
    return buffer

# -------------------- Header --------------------
st.markdown("<h1 style='text-align:center;'>AI Chest Disease Detection & Diagnosis System</h1>", unsafe_allow_html=True)
st.markdown("<hr>", unsafe_allow_html=True)

# -------------------- Tabs Navigation --------------------
tabs = st.tabs([
    "Normal", "Pneumonia", "Tuberculosis", "COVID-19", "Lung Cancer",
    "Bronchitis", "Asthma", "Emphysema", "Pulmonary Edema", "Full Report",
    "Patient History", "Analytics Dashboard"
])

tab_labels = [
    "Normal", "Pneumonia", "Tuberculosis", "COVID-19", "Lung Cancer",
    "Bronchitis", "Asthma", "Emphysema", "Pulmonary Edema", "Full Report",
    "Patient History", "Analytics Dashboard"
]

# -------------------- Main Tabs --------------------
for i, tab_container in enumerate(tabs):
    with tab_container:
        tab_name = tab_labels[i]
        st.header(f"{tab_name} Detection / Analysis")

        if tab_name != "Patient History" and tab_name != "Analytics Dashboard":
            # Patient Info
            with st.expander("Patient Information"):
                patient_name = st.text_input(f"Patient Name - {tab_name}", key=f"name_{i}")
                patient_age = st.number_input(f"Patient Age - {tab_name}", min_value=0, max_value=120, step=1, key=f"age_{i}")
                patient_gender = st.selectbox(f"Gender - {tab_name}", ["Male", "Female", "Other"], key=f"gender_{i}")
                patient_id = st.text_input(f"Patient ID - {tab_name}", key=f"id_{i}")

            # X-ray Upload
            uploaded_file = st.file_uploader(f"Upload Chest X-ray - {tab_name}", type=["jpg", "jpeg", "png"], key=f"upload_{i}")

            if uploaded_file:
                st.image(uploaded_file, caption="Uploaded X-ray", use_column_width=True)

                if st.button(f"Run {tab_name} Analysis", key=f"btn_{i}"):
                    if tab_name != "Full Report":
                        disease, confidence = predict_disease(uploaded_file, tab_name)

                        if disease in critical_diseases:
                            st.markdown(f"<div class='critical'><strong>Critical Disease Detected: {disease}!</strong></div>", unsafe_allow_html=True)

                        with st.expander("Prediction Result", expanded=True):
                            st.success(f"Predicted Disease: {disease}")
                            st.info(f"Confidence: {confidence*100:.2f}%")
                            st.markdown(f"**Recommendation:** {diseases[disease]}")

                        save_patient_info(patient_name, patient_age, patient_gender, patient_id, disease, confidence)

                        # PDF Download
                        pdf_buffer = generate_pdf({
                            "Name": patient_name,
                            "Age": patient_age,
                            "Gender": patient_gender,
                            "Patient ID": patient_id,
                            "Disease": disease,
                            "Confidence": f"{confidence*100:.2f}%",
                            "Date": datetime.now().strftime("%Y-%m-%d %H:%M:%S")
                        })
                        st.download_button("Download Report (PDF)", pdf_buffer, file_name="patient_report.pdf")

                    else:
                        # Full report
                        confidences = predict_multiple(uploaded_file)
                        col1, col2 = st.columns([2,1])
                        with col1:
                            st.markdown("### Patient & Diagnostic Summary")
                            st.write(f"**Name:** {patient_name}")
                            st.write(f"**Age:** {patient_age}")
                            st.write(f"**Gender:** {patient_gender}")
                            st.write(f"**Patient ID:** {patient_id}")
                            st.markdown("---")
                            with st.expander("Prediction Summary", expanded=True):
                                for d, c in confidences.items():
                                    st.write(f"**{d}:** {c*100:.2f}%")
                                    st.write(f"Recommendation: {diseases[d]}")
                            main_disease = max(confidences, key=confidences.get)
                            save_patient_info(patient_name, patient_age, patient_gender, patient_id, main_disease, confidences[main_disease])
                        with col2:
                            st.markdown("### Confidence Distribution")
                            fig = px.bar(x=list(confidences.keys()), y=list(confidences.values()), labels={'x':'Disease','y':'Confidence'})
                            st.plotly_chart(fig, use_container_width=True)

        # -------------------- Patient History Tab --------------------
        elif tab_name == "Patient History":
            st.subheader("All Patients History")
            if st.session_state.patients:
                df = pd.DataFrame(st.session_state.patients)

                # Search & filter
                search = st.text_input("Search Patient by Name or ID")
                min_conf = st.slider("Filter by Minimum Confidence", 0.0, 1.0, 0.5)
                df_filtered = df[df["Confidence"] >= min_conf]
                if search:
                    df_filtered = df_filtered[df_filtered["Name"].str.contains(search, case=False) | df_filtered["Patient ID"].str.contains(search, case=False)]

                st.dataframe(df_filtered)

                # Download CSV
                csv = df_filtered.to_csv(index=False).encode('utf-8')
                st.download_button("Download CSV", csv, "patient_history.csv", "text/csv")

            else:
                st.info("No patient data available.")

        # -------------------- Analytics Dashboard Tab --------------------
        elif tab_name == "Analytics Dashboard":
            st.subheader("Patient Analytics")
            if st.session_state.patients:
                df = pd.DataFrame(st.session_state.patients)

                # Disease filter
                selected_diseases = st.multiselect("Filter by Disease", df["Disease"].unique())
                if selected_diseases:
                    df = df[df["Disease"].isin(selected_diseases)]

                st.markdown("### Disease Distribution")
                fig1 = px.bar(df["Disease"].value_counts(), title="Disease Counts")
                st.plotly_chart(fig1, use_container_width=True)

                st.markdown("### Age Distribution")
                fig2 = px.histogram(df, x="Age", nbins=20, title="Age Histogram")
                st.plotly_chart(fig2, use_container_width=True)

                st.markdown("### Gender Distribution")
                fig3 = px.bar(df["Gender"].value_counts(), title="Gender Counts")
                st.plotly_chart(fig3, use_container_width=True)

                st.markdown("### Disease Pie Chart")
                fig4 = px.pie(df, names="Disease", title="Disease Breakdown")
                st.plotly_chart(fig4, use_container_width=True)
            else:
                st.info("No patient data to show analytics.")

