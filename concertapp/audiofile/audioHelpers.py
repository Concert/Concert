#!/usr/bin/env python

## @package audioHelpers

import os
import audiotools
import wave

from waveform import create_png

# The permissions (chmod) for new files that are created
NEW_FILE_PERMISSIONS = 0755

###
#   Takes as input a file of any format, and creates a wav file in the desired
#   format, making sure to throw errors along the way.
#
#   @param inputFilePath    String  The path of an audio file (any format)
#   @param outputFilePath   String  The path to the file to output to
#                                       (including .wav)
#
#   @throws   audiotools.UnsupportedFile  - if filetype is unsupported
#   @throws   IOError                     - if there was a problem opening
#   @throws   audiotools.PCMReaderError   - if there was an error decoding
#   @throws   Exception                   - unsupported audio channel config
#   @throws   Exception                   - unsupported bit-depth
#   @throws   audiotools.EncodingError    - encoding error
def toNormalizedWav(inputFilePath, outputFilePath):
    # open file (can raise errors)
    orig = audiotools.open(inputFilePath)
    

    ## Decode file to raw audio (PCM)
    origPCM = orig.to_pcm()



    # If this is a surround sound file, or if there is no channel mask
    # we shall error for now.  This will probably not happen.
    channel_mask = origPCM.channel_mask
    if channel_mask < 2 or channel_mask > 3:
      raise Exception ('Unsupported audio channel configuration')

  
    # Make sure bit depth is not > 16bit.
    # If it is, error for now.  I tried to convert the file, but I
    # get the following error: "data chunk ends prematurely"
    bits_per_sample = origPCM.bits_per_sample
    if bits_per_sample > 16:
        # Uncomment this line to try changing the bit depth:
        #bits_per_sample = 16
        # Comment this line to try changing the bit depth:
        raise Exception(
            'Unsupported bit depth, try converting file to 16bit.'
        )

    
    # Make sure sample rate is not > 44100
    sample_rate = origPCM.sample_rate
    # If original sample rate was greater than 44100
    if sample_rate > 44100:
      # Convert to 44100
      sample_rate = 44100



    # Create new PCM stream at 44100, with 2 channels
    normalizedPCM = audiotools.PCMConverter(origPCM, 44100, 2,
        channel_mask, bits_per_sample)

    

    # Output normalized audio to wav (Can raise error)
    wav = audiotools.WaveAudio.from_pcm(outputFilePath,
        normalizedPCM)

    os.chmod(outputFilePath, NEW_FILE_PERMISSIONS)
    
    


###
#   Takes as input an audio file of any format, and creates an ogg file at
#   the specified location.
#
#   @param  inputFilePath   String  The path to the input audio file (any
#                                   format)
#   @param  outputFilePath  String  The path to the output audio file (should
#                                   end in .ogg)
#
#   @throws audiotools.UnsupportedFile  If input filetype is not supported
#   @throws IOError                     If input file cannot be opened
#   @throws audiotools.EncodingError    Problems during encoding to PCM or ogg
def toOgg(inputFilePath, outputFilePath):
    ogg = audiotools.VorbisAudio.from_pcm(outputFilePath,
        audiotools.open(inputFilePath).to_pcm())
    os.chmod(outputFilePath, NEW_FILE_PERMISSIONS)
    
###
#   Takes as input an audio file of any format, and creates an mp3 file
#   at the specified location.
#
#   @param  inputFilePath   String  The path to the input audio file (any
#                                   format)
#   @param  outputFilePath  String  The path to the output audio file (should
#                                   end in .mp3)
#
#   @throws audiotools.UnsupportedFile  If input filetype is not supported
#   @throws IOError                     If input file cannot be opened
#   @throws audiotools.EncodingError    Problems during encoding to PCM or mp3
def toMp3(inputFilePath, outputFilePath):
    mp3 = audiotools.MP3Audio.from_pcm(outputFilePath,
        audiotools.open(inputFilePath).to_pcm())
    os.chmod(outputFilePath, NEW_FILE_PERMISSIONS)


## Gets the length, in seconds, of a wave file
#
# @param self Class object
#
# @return Number of seconds
def getLength(waveFilePath):
    waveFile = wave.open(waveFilePath, 'r')
    length = waveFile.getnframes() / waveFile.getframerate()
    waveFile.close()

    return length

## Generates the waveform image from a WAV file
#
# @param self Wav object
# @param imageFilePath The name of the file to write to
# @param imageWidth Width of image in pixels
# @param imageHeight Height of image in pixels
# @param channels The number of channels to generate images for. 0 chooses all channels
# @param fft_size Optional
# @param f_max Optional 
# @param f_min Optional
#
def generateWaveform(waveFilePath, imageFilePath, imageWidth, imageHeight, channels=None, fft_size=2048, f_max=22050, f_min=10):
    # Determine channels if unknown
    if not channels:
        src = wave.open(waveFilePath, 'rb')
        channels = src.getnchannels()
        src.close()

    create_png(waveFilePath, imageFilePath, imageWidth, imageHeight, channels, fft_size, f_max, f_min);
