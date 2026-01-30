<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class NoteController extends Controller
{
    /**
     * Get all notes for authenticated client
     * লগইন করা client এর সব notes পাওয়া
     */
    public function index(Request $request)
    {
        $clientId = $request->user()->id;
        
        $notes = DB::table('notes')
            ->where('client_id', $clientId)
            ->orderBy('created_at', 'desc') // Newest first
            ->get();

        return response()->json([
            'status' => 'success',
            'notes' => $notes
        ]);
    }

    /**
     * Create a new note
     * নতুন note তৈরি করা
     */
    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'text' => 'required|string',
            'date' => 'required|date',
            'time' => 'required'
        ]);

        $clientId = $request->user()->id;

        $noteId = DB::table('notes')->insertGetId([
            'client_id' => $clientId,
            'title' => $request->title,
            'text' => $request->text,
            'date' => $request->date,
            'time' => $request->time,
            'created_at' => now(),
            'updated_at' => now()
        ]);

        $note = DB::table('notes')->where('id', $noteId)->first();

        return response()->json([
            'status' => 'success',
            'message' => 'Note created successfully',
            'note' => $note
        ], 201);
    }

    /**
     * Update existing note
     * বিদ্যমান note আপডেট করা
     */
    public function update(Request $request, $id)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'text' => 'required|string',
            'date' => 'required|date',
            'time' => 'required'
        ]);

        $clientId = $request->user()->id;

        // Check if note exists and belongs to this client
        // নোট আছে কিনা এবং এই client এর কিনা চেক করা
        $note = DB::table('notes')
            ->where('id', $id)
            ->where('client_id', $clientId)
            ->first();

        if (!$note) {
            return response()->json([
                'status' => 'error',
                'message' => 'Note not found'
            ], 404);
        }

        // Update note
        DB::table('notes')
            ->where('id', $id)
            ->update([
                'title' => $request->title,
                'text' => $request->text,
                'date' => $request->date,
                'time' => $request->time,
                'updated_at' => now()
            ]);

        $updatedNote = DB::table('notes')->where('id', $id)->first();

        return response()->json([
            'status' => 'success',
            'message' => 'Note updated successfully',
            'note' => $updatedNote
        ]);
    }

    /**
     * Delete a note
     * Note মুছে ফেলা
     */
    public function destroy(Request $request, $id)
    {
        $clientId = $request->user()->id;

        // Check if note exists and belongs to this client
        $note = DB::table('notes')
            ->where('id', $id)
            ->where('client_id', $clientId)
            ->first();

        if (!$note) {
            return response()->json([
                'status' => 'error',
                'message' => 'Note not found'
            ], 404);
        }

        DB::table('notes')->where('id', $id)->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Note deleted successfully'
        ]);
    }

    /**
     * Search notes by title or date
     * Title বা date দিয়ে notes খুঁজা
     */
    public function search(Request $request)
    {
        $query = $request->input('query');
        $clientId = $request->user()->id;

        $notes = DB::table('notes')
            ->where('client_id', $clientId)
            ->where(function($q) use ($query) {
                $q->where('title', 'LIKE', "%{$query}%")
                  ->orWhere('date', 'LIKE', "%{$query}%");
            })
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'status' => 'success',
            'notes' => $notes
        ]);
    }
}
