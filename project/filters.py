from datetime import timedelta

def timefilter(td, type='minutes'):
    if not td:
        return None

    hours = td.seconds // 3600
    minutes = (td.seconds - hours * 3600) // 60
    seconds = td.seconds - minutes * 60 - hours * 3600
    milliseconds = td.microseconds // 1000

    result = '{:02d}:{:02d}.{:03d}'.format(minutes, seconds, milliseconds)

    if type == 'hours':
        result = '{:02d}:'.format(hours) + result

    return result
