"""Type stubs for datacollective.models."""

from enum import Enum

class Task(str, Enum):
    NA = "N/A"
    NLP = "NLP"
    ASR = "ASR"
    LI = "LI"
    TTS = "TTS"
    MT = "MT"
    LM = "LM"
    LLM = "LLM"
    NLU = "NLU"
    NLG = "NLG"
    CALL = "CALL"
    RAG = "RAG"
    CV = "CV"
    ML = "ML"
    OTHER = "Other"

class License(str, Enum):
    APACHE_2_0 = "Apache-2.0"
    BSD_3_CLAUSE = "BSD-3-Clause"
    CC_BY_4_0 = "CC-BY-4.0"
    CC_BY_ND_4_0 = "CC-BY-ND-4.0"
    CC_BY_NC_4_0 = "CC-BY-NC-4.0"
    CC_BY_NC_SA_4_0 = "CC-BY-NC-SA-4.0"
    CC_BY_SA_4_0 = "CC-BY-SA-4.0"
    CC_SA_1_0 = "CC-SA-1.0"
    CC0_1_0 = "CC0-1.0"
    EUPL_1_2 = "EUPL-1.2"
    AGPL_3_0 = "AGPL-3.0"
    GFDL_1_3 = "GFDL-1.3"
    GPL_3_0 = "GPL-3.0"
    LGPLLR = "LGPLLR"
    MIT = "MIT"
    MPL_2_0 = "MPL-2.0"
    NLOD_2_0 = "NLOD-2.0"
    NOODL_1_0 = "NOODL-1.0"
    ODC_BY_1_0 = "ODC-By-1.0"
    ODBL_1_0 = "ODbL-1.0"
    OGL_CANADA_2_0 = "OGL-Canada-2.0"
    OGL_UK_3_0 = "OGL-UK-3.0"
    OPUBL_1_0 = "OPUBL-1.0"
    OGDL_TAIWAN_1_0 = "OGDL-Taiwan-1.0"
    UNLICENSE = "Unlicense"

class DatasetSubmission:
    name: str | None
    shortDescription: str | None
    longDescription: str | None
    locale: str | None
    task: Task | None
    format: str | None
    licenseAbbreviation: License | str | None
    license: str | None
    licenseUrl: str | None
    other: str | None
    restrictions: str | None
    forbiddenUsage: str | None
    additionalConditions: str | None
    pointOfContactFullName: str | None
    pointOfContactEmail: str | None
    fundedByFullName: str | None
    fundedByEmail: str | None
    legalContactFullName: str | None
    legalContactEmail: str | None
    createdByFullName: str | None
    createdByEmail: str | None
    intendedUsage: str | None
    ethicalReviewProcess: str | None
    exclusivityOptOut: bool | None
    agreeToSubmit: bool | None
    id: str | None
    organizationId: str | None
    createdBy: str | None
    status: str | None
    slug: str | None
    fileUploadId: str | None
    exclusivityOptOutAt: str | None
    submittedAt: str | None
    createdAt: str | None
    updatedAt: str | None
    def __init__(
        self,
        *,
        name: str | None = ...,
        shortDescription: str | None = ...,
        longDescription: str | None = ...,
        locale: str | None = ...,
        task: Task | None = ...,
        format: str | None = ...,
        licenseAbbreviation: License | str | None = ...,
        license: str | None = ...,
        licenseUrl: str | None = ...,
        other: str | None = ...,
        restrictions: str | None = ...,
        forbiddenUsage: str | None = ...,
        additionalConditions: str | None = ...,
        pointOfContactFullName: str | None = ...,
        pointOfContactEmail: str | None = ...,
        fundedByFullName: str | None = ...,
        fundedByEmail: str | None = ...,
        legalContactFullName: str | None = ...,
        legalContactEmail: str | None = ...,
        createdByFullName: str | None = ...,
        createdByEmail: str | None = ...,
        intendedUsage: str | None = ...,
        ethicalReviewProcess: str | None = ...,
        exclusivityOptOut: bool | None = ...,
        agreeToSubmit: bool | None = ...,
        id: str | None = ...,
        organizationId: str | None = ...,
        createdBy: str | None = ...,
        status: str | None = ...,
        slug: str | None = ...,
        fileUploadId: str | None = ...,
        exclusivityOptOutAt: str | None = ...,
        submittedAt: str | None = ...,
        createdAt: str | None = ...,
        updatedAt: str | None = ...,
    ) -> None: ...
