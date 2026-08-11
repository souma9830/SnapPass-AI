"""
quality_metrics_formatter.py — AI Quality Score Metrics Response Formatter
Built for ELUSoC 2026 / GSSOC 2026.
"""
def format_quality_metrics_response(is_valid: bool, score: float, reasons: list = None) -> dict:
    return {
        "success": True,
        "is_valid": is_valid,
        "quality_score": round(score, 2),
        "reasons": reasons or [],
        "version": "ELUSoC_2026_v1"
    }
