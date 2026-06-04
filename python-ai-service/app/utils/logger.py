import logging
import sys

def setup_logger():
    logger = logging.getLogger("snappass-ai")
    logger.setLevel(logging.DEBUG)

    formatter = logging.Formatter(
        "[%(asctime)s] [%(levelname)s] in %(module)s: %(message)s"
    )

    # Console handler
    ch = logging.StreamHandler(sys.stdout)
    ch.setFormatter(formatter)
    logger.addHandler(ch)

    return logger

logger = setup_logger()
