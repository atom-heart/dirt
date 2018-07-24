from datetime import timedelta

def timefilter(td, hours=False):
    if not td:
        return None

    # Determine time intervals
    h = td.seconds // 3600
    m = (td.seconds - h * 3600) // 60
    s = td.seconds - m * 60 - h * 3600
    ms = td.microseconds // 1000

    # Format sconds, minutes and milliseconds
    time = '{:02d}:{:02d}.{:03d}'.format(m, s, ms)

    # Optionally format hours
    if hours:
        time = '{:02d}:'.format(h) + result

    return time
