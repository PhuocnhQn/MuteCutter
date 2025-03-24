# MuteCutter - Adobe Premiere Pro Extension

## Overview

MuteCutter is an Adobe Premiere Pro extension designed to automatically detect and cut out silent or low-volume segments from your video and audio tracks.  It analyzes an audio track, identifies periods of low audio levels (below a user-defined threshold), and then performs cuts on the corresponding video and audio tracks in your Premiere Pro sequence.  This greatly speeds up the process of removing silences, breaths, or unwanted pauses, especially in long-form content like interviews, podcasts, or vlogs.

## Features

*   **Automatic Silence Detection:** Analyzes a designated audio track to find segments below a specified decibel (dB) threshold.
*   **Adjustable Thresholds:**  Allows you to customize the dB level and minimum duration (in seconds) of silence to be considered for cutting.  This provides fine-grained control over what gets removed.
*   **Targeted Track Selection:** Lets you choose which audio and video tracks to analyze and cut.  You can specify the exact tracks you want to process, avoiding accidental edits to other tracks.
*   **Audio Track Locking:**  Automatically locks all audio tracks except the one you've chosen for analysis.  This prevents accidental edits to other audio during the analysis phase.
*   **Preset Application:** Applies a specific audio preset ("WAV 48 kHz 16-bit.epr") to the selected audio track *before* analysis. This ensures consistent audio processing and avoids issues caused by different audio formats or settings.
*   **User Interface:** Provides a simple and intuitive panel within Premiere Pro with input fields for:
    *   **Audio Track:**  The audio track number to analyze.
    *   **Video Track:** The video track number to cut.
    *   **Silence Duration (seconds):**  The minimum length of a silent segment to be cut.
    *   **dB Threshold:** The decibel level below which audio is considered silent.
    *  **Remove Cut Segment:** Check box option to remove segments that are below the threshold.
*   **Error Handling:** Includes robust error handling and displays informative messages to the user in case of problems (e.g., incorrect track numbers, audio analysis failures, file access issues).  Uses SweetAlert2 for user-friendly notifications.
* **Local Storage:** Save input value (Audio Track, Video Track, Silence Duration, dB Threshold, Remove Cut Segment) on local storage

## Installation

1.  **CEP Extension Installation:**  MuteCutter is a CEP (Common Extensibility Platform) extension.  You'll need to install it using a tool like:
    *   **ZXP Installer:**  A popular and easy-to-use tool for installing ZXP extensions. Download it from [zxpinstaller.com](https://zxpinstaller.com/).
    *   **Anastasiy's Extension Manager:**  Another option for managing CEP extensions.
    *   **Manual Installation:**  If you're comfortable with manual installation, you can copy the extension folder to the appropriate CEP extensions directory:
        *   **Windows:** `C:\Program Files (x86)\Common Files\Adobe\CEP\extensions` or `C:\Users\[username]\AppData\Roaming\Adobe\CEP\extensions`
        *   **macOS:** `/Library/Application Support/Adobe/CEP/extensions` or `~/Library/Application Support/Adobe/CEP/extensions`

2.  **Restart Premiere Pro:**  After installing the extension, restart Premiere Pro.

3.  **Enable the Extension:** Go to `Window > Extensions > MuteCutter` in Premiere Pro to open the extension panel.

## Usage

1.  **Prepare Your Sequence:** Open the Premiere Pro sequence you want to edit.  Make sure your audio and video are properly synced.

2.  **Open the MuteCutter Panel:**  Go to `Window > Extensions > MuteCutter`.

3.  **Set Parameters:**
    *   **Audio Track:** Enter the track number of the audio track you want to analyze (e.g., 1, 2, 3).  This is usually the track containing your primary dialogue or voiceover.
    *   **Video Track:** Enter the track number of the video track you want to cut (typically the same as the audio track, or a linked video track).
    *   **Silence Duration (seconds):**  Enter the minimum length of silence (in seconds) that should trigger a cut.  For example, `0.5` for half a second, `1` for one second.  Experiment to find the best value for your content.
    *   **dB Threshold:** Enter the decibel level below which audio will be considered silent.  Values like `-40` or `-50` dB are common starting points, but you'll need to adjust this based on your recording environment and audio levels.  Lower values mean *quieter* sounds will be considered silence.
    *   **Remove Cut Segment:** Check if you want to remove the detected segments.

4.  **Run the Script:** Click the "Cut" button.

5. **Processing** During processing. It will lock your action and show `Processing`. Please don't do any other action on the extension

6.  **Review the Results:** MuteCutter will:
    *   Lock all audio tracks except the one you specified.
    *   Apply the "WAV 48 kHz 16-bit.epr" preset to the selected audio track.
    *   Analyze the audio.
    *   Create cuts on the specified video and audio tracks at the detected silent segments.  *Important:*  The cuts are made, but the silent segments are *not* automatically deleted.  This allows you to review the cuts and make adjustments if needed.

7.  **Refine and Adjust:**  After the cuts are made, manually review the timeline.  You may need to:
    *   Undo cuts (Ctrl+Z / Cmd+Z) if any were made in error.
    *   Adjust the timing of cuts.
    *   Delete the silent segments (select the clips and press Delete).
    *   Add transitions (like crossfades) to smooth out the cuts.

## Important Notes and Considerations

*   **Audio Preset:** The script assumes the "WAV 48 kHz 16-bit.epr" preset is located in the `[Extension Folder]/Preset/Audio/` directory.  Make sure this preset exists in the correct location. The extension creates a temporary WAV file in the user's `AppData\AutoCutBLV` folder for analysis. This file is used internally and doesn't need to be managed by the user.
*   **Backup:**  It's *highly recommended* to create a duplicate of your sequence *before* running MuteCutter. This provides a backup in case you need to revert to the original, unedited version.
*   **Experimentation:**  The optimal settings for `Silence Duration` and `dB Threshold` will vary depending on your audio.  Start with conservative values and experiment to find what works best for your specific project.
*   **Noise Reduction:** For best results, consider applying noise reduction to your audio *before* using MuteCutter. This will help the extension accurately identify true silences.
*   **Linked Clips:** If your audio and video are linked, cuts made to one track will typically affect the other.
*   **Overlapping Audio:**  If you have multiple audio tracks with overlapping dialogue, MuteCutter will only analyze the track you specify. You may need to manually edit other tracks.
*  **Dependencies:** The script uses the `wav-decoder` npm package. You must run `npm install` in the extension's root directory to install it.
* **Error "Cannot read property 'timecode' of null":** This usually indicates that the extension can't find a clip on the specified track at the current time.  Make sure that:
        * You have clips on the audio and video tracks you've specified.
        * The playhead is positioned within the duration of a clip on those tracks.
        * You're not targeting an empty track or a gap in the timeline.

## Troubleshooting

*   **Extension doesn't appear:** Make sure the extension is installed correctly and that you've restarted Premiere Pro.  Check your CEP extensions folder.
*   **Cuts are not accurate:** Adjust the `dB Threshold` and `Silence Duration` settings.  Consider applying noise reduction to your audio.
*   **Error messages:**  Pay close attention to any error messages displayed by the extension. They often provide clues about the problem.  Check the Premiere Pro console (`Window > Extensions > [Your Extension Name] > Debug`) for more detailed error information.

## Development

This extension is built using HTML, JavaScript, and the Adobe CEP framework.  Key files include:

*   `index.html`:  The main UI of the extension panel.
*   `main.js`:  The JavaScript code that handles user interaction, audio analysis, and communication with Premiere Pro.
*   `CSInterface.js`:  The Adobe CEP library that enables communication between the extension and Premiere Pro.
*  `jsx`: Folder contains script bridge to interact with Premier Pro

To modify or extend the script:

1.  **Edit the files:** Use a code editor to modify the HTML, JavaScript, and JSX files.
2.  **Debug:** Use the Chrome DevTools to debug the extension.  In Premiere Pro, go to `Window > Extensions > [Your Extension Name] > Debug`.
3.  **Reload:**  After making changes, reload the extension in Premiere Pro.  You can usually do this by right-clicking on the extension panel and choosing "Reload" or "Debug".

## Hire Me

Need help with Adobe Premiere Pro extensions, automation, or video editing workflows?  I'm available for freelance work!

*   **Upwork:**  [https://www.upwork.com/freelancers/~01efdc14edfa7aaecc]  *(Replace with your actual Upwork profile link)*
*   **Fiverr:** [https://www.fiverr.com/sellers/huphuoc] *(Replace with your actual Fiverr profile link)*

Feel free to reach out to discuss your project requirements.

## License

This project is licensed under the [MIT License](LICENSE) - see the LICENSE file for details. (You'll need to create a LICENSE file and put the MIT license text in it).

## Acknowledgements

*   [wav-decoder](https://www.npmjs.com/package/wav-decoder) - Used for decoding WAV audio files.
*   [SweetAlert2](https://sweetalert2.github.io/) - Used for displaying user-friendly alerts and messages.
*   Adobe CEP Documentation - Essential for understanding how to build Premiere Pro extensions.